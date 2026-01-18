<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use App\Models\People;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:set-clave {email : Email del admin} {clave : Clave en texto plano}', function () {
    $email = (string) $this->argument('email');
    $clave = (string) $this->argument('clave');

    $person = People::where('email', $email)->where('is_admin', true)->first();
    if (!$person) {
        $this->error('No se encontró un admin con ese email.');
        return 1;
    }

    if (strlen($clave) < 6) {
        $this->error('La clave debe tener al menos 6 caracteres.');
        return 1;
    }

    $person->clave_hash = Hash::make($clave);
    $person->save();

    $this->info('Clave del admin actualizada (guardada como hash).');
    return 0;
})->purpose('Setea/rota la clave de acceso al panel admin para un usuario admin');

Artisan::command('admin:clear-clave {email : Email del admin}', function () {
    $email = (string) $this->argument('email');

    $person = People::where('email', $email)->where('is_admin', true)->first();
    if (!$person) {
        $this->error('No se encontró un admin con ese email.');
        return 1;
    }

    $person->clave_hash = null;
    $person->save();

    $this->info('Clave del admin eliminada. El login volverá a funcionar sin clave para este usuario.');
    return 0;
})->purpose('Elimina la clave de acceso al panel admin para un usuario admin');
