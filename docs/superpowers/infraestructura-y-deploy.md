# Infraestructura y deploy — oraconmigo.app

> Última actualización: 2026-07-23

Documento operativo del despliegue en producción. Escrito tras el incidente del
502 del 2026-07-23 (ver más abajo).

---

## Mapa de producción

```
oraconmigo.app  ──DNS A──►  190.112.223.9   (VPS propio, usuario `coder`)
www.oraconmigo.app ──CNAME──► oraconmigo.app
                                   │
                                   ▼
                            Caddy (reverse proxy, TLS)
                            :80 → 308 redirect a https
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            Next.js 16 en :4000            Laravel 12 (Sanctum)
            (pm2, proceso `oraconmigo`)    /admin/*, /api/*, /sanctum/*
            /var/www/oraconmigo/frontend   /var/www/oraconmigo/backend
```

**Datos que no son obvios y cuestan encontrar:**

- El frontend corre en el **puerto 4000**, no 3000. Viene de
  `frontend/package.json` → `"start": "next start -p 4000"`.
  **El README raíz dice 3000 y está desactualizado.**
- No hay Docker ni Vercel. Es un VPS con Caddy + pm2 + php8.4.
- PHP en el servidor está en rutas absolutas: `/usr/bin/php8.4` y
  `/usr/local/bin/composer`. Node se carga vía nvm (`$HOME/.nvm/nvm.sh`).
- La IP del servidor vive en la **variable de repo de GitHub Actions**
  `REMOTEHOST`, no en el código.

### Cómo verificar salud sin SSH

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://oraconmigo.app/          # 200
curl -sS -o /dev/null -w "%{http_code}\n" https://oraconmigo.app/admin     # 302 (Laravel vivo)
curl -sS -o /dev/null -w "%{http_code}\n" https://oraconmigo.app/sanctum/csrf-cookie  # 204
```

Interpretación de un **502 de Caddy**: el proxy está vivo pero el upstream no
responde. Casi siempre significa que el proceso pm2 del frontend no está
corriendo. No es DNS ni certificados.

---

## Deploy

`.github/workflows/deploy.yml` — se dispara en **cada push a `main`**.
Entra por SSH como `coder@$REMOTEHOST` y en `/var/www/oraconmigo` ejecuta:

1. `git fetch origin main && git reset --hard origin/main`
2. `backend/`: `composer install` + `php artisan migrate --force`
3. `frontend/`: `npm install` + `npm run build`
4. `pm2 startOrRestart ecosystem.config.js --update-env && pm2 save`

**Consecuencias a tener presentes:**

- Un push a `main` **redespliega producción de inmediato**. Para commits que no
  tocan la app (docs, notas), usar `[skip ci]` en el mensaje del commit.
- El paso 1 es `reset --hard`: cualquier cambio hecho a mano en el servidor sobre
  archivos versionados **se pierde** en el siguiente deploy.
- GitHub Actions decide qué workflows correr según los archivos presentes **en el
  commit que se pushea**. Si un push deja el repo sin `.github/workflows/`,
  **no se dispara ningún deploy** (esto fue clave en el incidente de julio).

### Trampa histórica: `migrate:fresh`

Hasta el 2026-01-19 el workflow corría `php artisan migrate:fresh --seed --force`,
que **borra todas las tablas en cada deploy**. Lo corrigió el commit `c16f695`
("Ajuste deploy", Wilmer Márquez) a `migrate --force`.

**No volver a introducir `migrate:fresh` en el workflow.** Si alguien ve una copia
vieja del deploy.yml (anterior al 19-ene), esa versión destruye la base.

---

## Incidente 2026-07-23 — 502 Bad Gateway

### Síntoma
`oraconmigo.app` devolvía `502` desde Caddy. Coincidió en el tiempo con un push
que reemplazó el repo, lo que hizo sospechar del push.

### Causa raíz
El proceso pm2 llamado `oraconmigo` **había desaparecido de la lista de pm2** —
no estaba caído, no existía. Log del deploy:

```
[PM2][ERROR] Process or Namespace oraconmigo not found
```

Sin proceso, nada escuchaba en `:4000` → Caddy respondía 502. El proceso se había
creado **a mano** en el servidor (no había ningún `ecosystem.config.js` en el
repo), así que un reboot del VPS entre enero y julio se lo llevó y nadie lo
volvió a levantar. El último deploy exitoso previo era del 2026-01-20.

### Lo que NO fue la causa
El push del 2026-07-22/23 que reemplazó `main` con código de Figma Make **no
disparó ningún deploy**, porque ese commit no incluía `.github/workflows/`.
El servidor nunca se enteró. Verificado por tres vías: cero runs de Actions en
julio, ausencia de `.github/` en el árbol del commit, y lista de workflows
registrados vacía en la API de GitHub.

**Lección:** el 502 llevaba potencialmente meses latente. La coincidencia
temporal con el push era casualidad. Verificar antes de asumir causalidad.

### Solución aplicada (commit `e679d35`)
- Se agregó **`frontend/ecosystem.config.js`**, que versiona la definición del
  proceso. Antes solo existía en la memoria de pm2 del servidor: conocimiento
  no reproducible.
- El workflow pasó de `pm2 restart` a `pm2 startOrRestart ... && pm2 save`, que
  es idempotente: si el proceso no existe lo crea en vez de fallar.

### ⚠️ Pendiente sin cerrar
Falta correr **una sola vez** en el servidor, con sudo:

```bash
pm2 startup      # imprime una línea `sudo env PATH=...`; ejecutarla
pm2 save
```

`pm2 save` (ya en el workflow) guarda la lista de procesos, pero **sin
`pm2 startup` no existe la unidad systemd que la restaura al bootear**. Mientras
esto no se haga, **el próximo reinicio del VPS reproduce el mismo 502**.

Verificar con: `systemctl is-enabled pm2-coder`

---

## Repositorios — cuál es cuál

| Repo | Qué es | Estado |
|---|---|---|
| `leogomez74/oraconmigo` | **La app en producción.** Laravel 12 + Next.js 16. Es el que despliega a oraconmigo.app | Activo |
| `leogomez74/oraconmigoapp` | Scaffold de **Figma Make** (Vite + React + TS, ~24 archivos, `.figma/make/`). Autor de los commits: `sboxd <sbox@figma.com>` | Separado, no despliega a nada |

**Ojo:** Figma Make publica commits con historia **no relacionada** (initial
commit huérfano) y **sobrescribe la rama por completo**. El 2026-07-22/23 le cayó
encima a `oraconmigo` por error, borrando `backend/`, `frontend/` y el workflow.
Se restauró con force push a `81e8e15`. Si se vuelve a usar Figma Make,
apuntarlo **siempre** a `oraconmigoapp`, nunca a `oraconmigo`.

### Recuperar historia después de un force push accidental

Los commits sobrescritos **no se pierden de inmediato**: siguen accesibles en la
API de GitHub por SHA y como objetos sueltos en cualquier clon local que los
hubiera fetcheado. El SHA se saca de los runs viejos de Actions:

```bash
gh run list --repo leogomez74/oraconmigo --limit 20
gh api repos/leogomez74/oraconmigo/actions/runs/<RUN_ID> --jq .head_sha
git cat-file -t <SHA>              # ¿está local?
git ls-tree -r --name-only <SHA>   # ¿el árbol está completo?
git branch respaldo <SHA>
```

Antes de un force push de recuperación, respaldar siempre lo que se va a pisar
(`git branch <nombre> <sha-remoto-actual>`) y usar `--force-with-lease`.

---

## Accesos

- **SSH a producción:** usuario `coder@190.112.223.9`, puerto 22 abierto.
  La llave de deploy vive en el secret de GitHub `SSH_PRIVATE_KEY` (no legible).
  Las llaves personales del equipo deben autorizarse en `~/.ssh/authorized_keys`
  de `coder`. Sin eso no hay diagnóstico manual posible y hay que operar el
  servidor a través del workflow de deploy.
- **GitHub:** `gh` CLI autenticado como `leogomez74`.

## Colaboradores vistos en la historia

`leogomez74`, `RichardGonza <richard@gomez.cr>`, `Wilmer Márquez`.
