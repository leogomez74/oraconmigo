import React from 'react';

export default function TerminosGenerales() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          TÉRMINOS Y CONDICIONES DE USO
        </h2>
        <p className="text-indigo-600 font-medium mt-2">ORA - Aplicación de Oración con Inteligencia Artificial</p>
        <p className="text-sm text-gray-500 mt-1">Última actualización: Enero 2026</p>
        <div className="h-1 w-20 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar text-sm leading-relaxed">
        
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">1. Aceptación de los Términos</h3>
          <p>Al descargar, instalar o utilizar la aplicación ORA (&quot;la App&quot;), aceptas estar legalmente vinculado por estos Términos y Condiciones de Uso (&quot;Términos&quot;). Si no estás de acuerdo con estos Términos, no utilices la App.</p>
          <p className="mt-2">ORA es propiedad y está operada por [Nombre de tu Empresa] (&quot;la Empresa&quot;, &quot;nosotros&quot;, &quot;nuestro&quot;). Estos Términos constituyen un acuerdo legal entre tú y la Empresa.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">2. Descripción del Servicio</h3>
          <p>ORA es una aplicación de bienestar espiritual que utiliza inteligencia artificial para ayudar a los usuarios a orar. Los servicios incluyen:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Generación de oraciones personalizadas mediante IA</li>
            <li>Conversión de oraciones a audio con voces naturales</li>
            <li>Acceso a la Biblia Reina Valera 1960</li>
            <li>Juego de trivia bíblica (Bible Game)</li>
            <li>Sistema de rachas y gamificación</li>
            <li>Recordatorios personalizados de oración</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">3. Elegibilidad</h3>
          <p>Para usar ORA, debes tener al menos 13 años de edad. Si eres menor de 18 años, declaras que tienes el consentimiento de tus padres o tutores legales para usar la App. Al usar ORA, declaras y garantizas que cumples con estos requisitos de elegibilidad.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">4. Cuenta de Usuario</h3>
          <h4 className="font-semibold text-gray-800 mt-3">4.1 Creación de Cuenta</h4>
          <p>Para acceder a todas las funciones de ORA, debes crear una cuenta proporcionando información precisa y completa. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
          
          <h4 className="font-semibold text-gray-800 mt-3">4.2 Seguridad de la Cuenta</h4>
          <p>Debes notificarnos inmediatamente si sospechas de cualquier uso no autorizado de tu cuenta. No somos responsables de pérdidas derivadas del uso no autorizado de tu cuenta si no nos has notificado.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">5. Suscripciones y Pagos</h3>
          <h4 className="font-semibold text-gray-800 mt-3">5.1 Modelo Freemium</h4>
          <p>ORA ofrece funcionalidades gratuitas con publicidad (&quot;Plan Gratuito&quot;) y una suscripción de pago sin publicidad con funciones premium (&quot;Plan Premium&quot;).</p>

          <h4 className="font-semibold text-gray-800 mt-3">5.2 Plan Premium</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Precio: $4.99 USD por mes</li>
            <li>Período de prueba: 7 días gratuitos para nuevos usuarios</li>
            <li>Renovación automática: La suscripción se renueva automáticamente a menos que se cancele</li>
            <li>Cancelación: Puedes cancelar en cualquier momento desde tu cuenta de Apple/Google</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-3">5.3 Procesamiento de Pagos</h4>
          <p>Los pagos son procesados por Apple App Store o Google Play Store, según tu dispositivo. No almacenamos información de tarjetas de crédito. Consulta las políticas de pago de Apple/Google para más información.</p>

          <h4 className="font-semibold text-gray-800 mt-3">5.4 Reembolsos</h4>
          <p>Los reembolsos están sujetos a las políticas de Apple App Store o Google Play Store. Puedes solicitar un reembolso directamente a través de ellos dentro de los plazos establecidos por sus políticas.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">6. Uso Aceptable</h3>
          <p>Al usar ORA, aceptas NO:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Usar la App para fines ilegales o no autorizados</li>
            <li>Intentar hackear, descompilar o realizar ingeniería inversa de la App</li>
            <li>Transmitir virus, malware o código malicioso</li>
            <li>Interferir con el funcionamiento normal de la App</li>
            <li>Crear cuentas falsas o suplantar identidades</li>
            <li>Usar la App para acosar, amenazar o dañar a otros</li>
            <li>Reproducir, duplicar o revender el servicio sin autorización</li>
            <li>Usar bots o métodos automatizados para acceder a la App</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">7. Propiedad Intelectual</h3>
          <h4 className="font-semibold text-gray-800 mt-3">7.1 Nuestra Propiedad</h4>
          <p>La App, incluyendo su diseño, código, gráficos, interfaces, logos y marcas comerciales, es propiedad de la Empresa y está protegida por leyes de propiedad intelectual. No adquieres ningún derecho de propiedad sobre la App.</p>

          <h4 className="font-semibold text-gray-800 mt-3">7.2 Tu Contenido</h4>
          <p>Conservas la propiedad de cualquier contenido que crees en la App (oraciones guardadas, notas, etc.). Nos otorgas una licencia limitada para almacenar y mostrar este contenido únicamente para proporcionarte el servicio.</p>

          <h4 className="font-semibold text-gray-800 mt-3">7.3 Contenido de Terceros</h4>
          <p>El texto de la Biblia Reina Valera 1960 se utiliza conforme a su licencia de dominio público. Las oraciones generadas por IA son creadas para tu uso personal.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">8. Uso de Inteligencia Artificial</h3>
          <h4 className="font-semibold text-gray-800 mt-3">8.1 Naturaleza del Contenido Generado</h4>
          <p>Las oraciones generadas por ORA utilizan inteligencia artificial y tienen como objetivo ayudarte en tu vida de oración. El contenido generado es una herramienta de apoyo y no reemplaza el consejo pastoral, teológico o profesional de salud mental.</p>

          <h4 className="font-semibold text-gray-800 mt-3">8.2 Limitaciones</h4>
          <p>Aunque nos esforzamos por proporcionar contenido bíblicamente sólido, la IA puede ocasionalmente generar contenido imperfecto. No garantizamos la precisión teológica absoluta de cada oración generada. Te animamos a usar tu discernimiento personal.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">9. Exención de Responsabilidad</h3>
          <p>ORA se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;. No garantizamos que la App esté libre de errores o interrupciones. En la máxima medida permitida por la ley:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>No ofrecemos garantías expresas o implícitas sobre la App</li>
            <li>No garantizamos que la App cumpla con tus expectativas específicas</li>
            <li>No somos responsables de decisiones que tomes basándote en el contenido de la App</li>
            <li>No somos responsables de problemas técnicos fuera de nuestro control</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">10. Limitación de Responsabilidad</h3>
          <p>En ningún caso la Empresa, sus directores, empleados o afiliados serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de datos, beneficios o uso, derivados de tu uso de la App. Nuestra responsabilidad total no excederá el monto que hayas pagado por la suscripción en los últimos 12 meses.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">11. Indemnización</h3>
          <p>Aceptas indemnizar y mantener indemne a la Empresa de cualquier reclamación, daño, pérdida o gasto (incluyendo honorarios legales) que surja de tu uso de la App, tu violación de estos Términos, o tu violación de derechos de terceros.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">12. Terminación</h3>
          <p>Podemos suspender o terminar tu acceso a ORA en cualquier momento, sin previo aviso, si creemos que has violado estos Términos. Puedes terminar tu cuenta en cualquier momento eliminándola desde la configuración de la App. Tras la terminación, las secciones que por su naturaleza deban sobrevivir (propiedad intelectual, limitación de responsabilidad, etc.) permanecerán vigentes.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">13. Modificaciones</h3>
          <p>Nos reservamos el derecho de modificar estos Términos en cualquier momento. Te notificaremos de cambios significativos mediante la App o por correo electrónico. El uso continuado de ORA después de dichos cambios constituye tu aceptación de los Términos modificados.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">14. Ley Aplicable y Jurisdicción</h3>
          <p>Estos Términos se rigen por las leyes de [País/Estado]. Cualquier disputa se resolverá en los tribunales competentes de [Jurisdicción]. Antes de iniciar cualquier procedimiento legal, ambas partes intentarán resolver la disputa mediante negociación de buena fe.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">15. Divisibilidad</h3>
          <p>Si alguna disposición de estos Términos se considera inválida o inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">16. Acuerdo Completo</h3>
          <p>Estos Términos, junto con nuestra Política de Privacidad, constituyen el acuerdo completo entre tú y la Empresa respecto al uso de ORA, y reemplazan cualquier acuerdo previo.</p>
        </section>

        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">17. Contacto</h3>
          <p>Para preguntas sobre estos Términos, contáctanos:</p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:legal@ora-app.com" className="text-indigo-600 hover:underline">legal@ora-app.com</a><br />
            <strong>Sitio web:</strong> <a href="https://www.ora-app.com/terminos" className="text-indigo-600 hover:underline">www.ora-app.com/terminos</a><br />
            <strong>Dirección:</strong> [Dirección de tu empresa]
          </p>
        </section>

      </div>
    </div>
  );
}