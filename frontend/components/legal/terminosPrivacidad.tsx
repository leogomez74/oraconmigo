import React from 'react';

export default function TerminosPrivacidad() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Política de Privacidad
        </h2>
        <p className="text-indigo-600 font-medium mt-2">ORA - Aplicación de Oración con Inteligencia Artificial</p>
        <p className="text-sm text-gray-500 mt-1">Última actualización: Enero 2026</p>
        <div className="h-1 w-20 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar text-sm leading-relaxed">
        
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">1. Introducción</h3>
          <p>
            Bienvenido a ORA. Tu privacidad es fundamental para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra aplicación móvil.
          </p>
          <p className="mt-2">
            ORA es operada por [Nombre de tu Empresa] (en adelante, &quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Empresa&quot;). Al utilizar ORA, aceptas las prácticas descritas en esta política.
          </p>
        </section>

        <section className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">2. Nuestro Compromiso con tu Privacidad</h3>
          <ul className="space-y-3">
            <li>
              <strong className="text-indigo-800">NO VENDEMOS TUS DATOS.</strong> Bajo ninguna circunstancia vendemos, alquilamos o comercializamos tu información personal a terceros.
            </li>
            <li>
              <strong className="text-indigo-800">NO COMPARTIMOS TUS DATOS.</strong> Tu información personal, incluyendo tus oraciones y datos espirituales, no se comparte con terceros para fines de marketing, publicidad o cualquier otro propósito comercial.
            </li>
            <li>
              <strong className="text-indigo-800">TUS ORACIONES SON PRIVADAS.</strong> El contenido de tus oraciones, estados emocionales y actividad espiritual es estrictamente confidencial y está protegido.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">3. Información que Recopilamos</h3>
          
          <h4 className="font-semibold text-gray-800 mt-3">3.1 Información que nos proporcionas directamente</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Información de cuenta: nombre, correo electrónico, contraseña encriptada</li>
            <li>Preferencias de oración: tipos de oración preferidos, horarios de recordatorio</li>
            <li>Contenido generado: oraciones guardadas, versículos favoritos, notas personales</li>
            <li>Información de perfil opcional: foto de perfil, denominación religiosa</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-3">3.2 Información recopilada automáticamente</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Datos de uso: frecuencia de uso, funciones utilizadas, tiempo en la app</li>
            <li>Información del dispositivo: modelo, sistema operativo, identificadores únicos</li>
            <li>Datos de rendimiento: errores, crashes, tiempos de carga</li>
            <li>Datos de suscripción: estado de la suscripción, fecha de renovación</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-3">3.3 Información que NO recopilamos</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>NO recopilamos tu ubicación precisa</li>
            <li>NO accedemos a tus contactos, fotos o archivos personales</li>
            <li>NO recopilamos información financiera directamente (los pagos son procesados por Apple/Google)</li>
            <li>NO grabamos audio sin tu consentimiento explícito</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">4. Cómo Usamos tu Información</h3>
          <p>Utilizamos tu información únicamente para:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Proporcionar y mejorar los servicios de ORA</li>
            <li>Generar oraciones personalizadas mediante inteligencia artificial</li>
            <li>Convertir oraciones a audio mediante tecnología text-to-speech</li>
            <li>Enviar recordatorios de oración según tus preferencias</li>
            <li>Mantener tu racha de oración y estadísticas personales</li>
            <li>Procesar tu suscripción y brindarte soporte técnico</li>
            <li>Cumplir con obligaciones legales cuando sea requerido</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">5. Uso de Inteligencia Artificial</h3>
          <p>ORA utiliza servicios de inteligencia artificial para generar oraciones personalizadas y convertirlas a audio. Es importante que entiendas cómo funciona:</p>
          
          <h4 className="font-semibold text-gray-800 mt-3">5.1 Generación de Oraciones</h4>
          <p>Utilizamos modelos de lenguaje de IA para crear oraciones basadas en tu estado emocional. Los datos enviados al modelo de IA son anónimos y no incluyen información que te identifique personalmente. No almacenamos el contenido de las solicitudes en servidores de terceros más allá del tiempo necesario para generar la respuesta.</p>

          <h4 className="font-semibold text-gray-800 mt-3">5.2 Conversión de Texto a Voz</h4>
          <p>Las oraciones pueden convertirse a audio mediante tecnología text-to-speech. El texto se procesa para generar el audio y no se almacena permanentemente en servidores externos. Los archivos de audio generados se almacenan de forma segura para tu uso personal.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">6. Proveedores de Servicios</h3>
          <p>Trabajamos con proveedores de servicios limitados que nos ayudan a operar ORA. Estos proveedores están contractualmente obligados a proteger tu información y solo pueden usarla para proporcionar servicios a ORA:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Servicios de infraestructura en la nube (almacenamiento seguro de datos)</li>
            <li>Servicios de procesamiento de pagos (Apple App Store, Google Play Store)</li>
            <li>Servicios de análisis anónimos (para mejorar la experiencia de usuario)</li>
            <li>Servicios de notificaciones push (para recordatorios de oración)</li>
          </ul>
          <p className="mt-2 font-semibold">Importante: Ninguno de estos proveedores tiene acceso al contenido de tus oraciones o puede usar tus datos para sus propios fines.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">7. Seguridad de tus Datos</h3>
          <p>Implementamos medidas de seguridad robustas para proteger tu información:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Encriptación de datos en tránsito (TLS/SSL)</li>
            <li>Encriptación de datos en reposo (AES-256)</li>
            <li>Contraseñas hasheadas con algoritmos seguros</li>
            <li>Autenticación segura con tokens JWT</li>
            <li>Acceso restringido a datos personales (principio de mínimo privilegio)</li>
            <li>Monitoreo continuo de seguridad</li>
            <li>Copias de seguridad encriptadas</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">8. Retención de Datos</h3>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Mantenemos tu información mientras tu cuenta esté activa</li>
            <li>Puedes eliminar tu cuenta y datos en cualquier momento desde la app</li>
            <li>Tras la eliminación, tus datos se borran permanentemente en un plazo de 30 días</li>
            <li>Algunos datos anónimos y agregados pueden conservarse para análisis estadístico</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">9. Tus Derechos</h3>
          <p>Tienes los siguientes derechos sobre tus datos personales:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Acceso:</strong> Puedes solicitar una copia de tus datos personales</li>
            <li><strong>Rectificación:</strong> Puedes corregir datos inexactos en tu perfil</li>
            <li><strong>Eliminación:</strong> Puedes solicitar la eliminación de tu cuenta y datos</li>
            <li><strong>Portabilidad:</strong> Puedes exportar tus oraciones guardadas</li>
            <li><strong>Oposición:</strong> Puedes oponerte al procesamiento de ciertos datos</li>
          </ul>
          <p className="mt-2">Para ejercer estos derechos, contáctanos en: <a href="mailto:privacy@ora-app.com" className="text-indigo-600 hover:underline">privacy@ora-app.com</a></p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">10. Privacidad de Menores</h3>
          <p>
            ORA no está dirigida a menores de 13 años. No recopilamos intencionalmente información de niños menores de 13 años. Si descubrimos que hemos recopilado datos de un menor sin verificación del consentimiento parental, eliminaremos esa información de inmediato. Si crees que tu hijo ha proporcionado información a ORA, contáctanos.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2">11. Cambios a esta Política</h3>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos mediante la app o por correo electrónico. El uso continuado de ORA después de dichos cambios constituye tu aceptación de la política actualizada.
          </p>
        </section>

        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">12. Contacto</h3>
          <p>Si tienes preguntas sobre esta Política de Privacidad, contáctanos:</p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:privacy@ora-app.com" className="text-indigo-600 hover:underline">privacy@ora-app.com</a><br />
            <strong>Sitio web:</strong> <a href="https://www.ora-app.com/privacidad" className="text-indigo-600 hover:underline">www.ora-app.com/privacidad</a><br />
            <strong>Dirección:</strong> [Dirección de tu empresa]
          </p>
        </section>

      </div>
    </div>
  );
}