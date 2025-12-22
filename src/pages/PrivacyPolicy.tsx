import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 md:mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </Link>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary text-glow-subtle mb-4">
          Política de Privacidad
        </h1>
        <p className="text-foreground/40 text-sm mb-12">
          Última actualización: 14 de diciembre de 2024
        </p>

        {/* Content */}
        <div className="space-y-10">
          
          {/* Responsable */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              1. Responsable del tratamiento
            </h2>
            <div className="text-foreground/70 space-y-2">
              <p><span className="text-foreground/50">Nombre:</span> Anxo</p>
              <p><span className="text-foreground/50">Email:</span>{' '}
                <a href="mailto:holaaanxo@gmail.com" className="text-primary hover:underline">
                  holaaanxo@gmail.com
                </a>
              </p>
              <p><span className="text-foreground/50">Web:</span>{' '}
                <a href="https://ladosis.vercel.app" className="text-primary hover:underline">
                  ladosis.vercel.app
                </a>
              </p>
            </div>
          </section>

          {/* Datos que recopilamos */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              2. Datos que recopilamos
            </h2>
            <ul className="text-foreground/70 space-y-2 list-disc list-inside">
              <li>Email del usuario</li>
              <li>Nombre del usuario</li>
              <li>Número de teléfono (solo para validación, no se almacena)</li>
            </ul>
          </section>

          {/* Finalidad */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              3. Finalidad del tratamiento
            </h2>
            <ul className="text-foreground/70 space-y-2 list-disc list-inside">
              <li>Envío de newsletter con contenido exclusivo</li>
              <li>Comunicaciones relacionadas con anxonews</li>
            </ul>
          </section>

          {/* Base legal */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              4. Base legal
            </h2>
            <ul className="text-foreground/70 space-y-2 list-disc list-inside">
              <li>Consentimiento explícito del usuario (checkbox antes de suscribirse)</li>
              <li>Interés legítimo para prevenir spam y fraude</li>
            </ul>
          </section>

          {/* Destinatarios */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              5. Destinatarios de los datos
            </h2>
            <div className="text-foreground/70 space-y-2">
              <p>
                <span className="font-medium text-foreground">MailerLite:</span> Utilizamos MailerLite como proveedor de email marketing para gestionar el envío de newsletters.
              </p>
              <p className="text-primary/80">
                Los datos NO se venden ni comparten con terceros.
              </p>
            </div>
          </section>

          {/* Derechos */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              6. Tus derechos
            </h2>
            <p className="text-foreground/70 mb-4">
              Tienes derecho a:
            </p>
            <ul className="text-foreground/70 space-y-2 list-disc list-inside mb-4">
              <li><span className="font-medium">Acceso:</span> Solicitar una copia de tus datos</li>
              <li><span className="font-medium">Rectificación:</span> Corregir datos inexactos</li>
              <li><span className="font-medium">Supresión:</span> Eliminar tus datos (darte de baja)</li>
              <li><span className="font-medium">Portabilidad:</span> Recibir tus datos en formato estructurado</li>
              <li><span className="font-medium">Oposición:</span> Oponerte al tratamiento de tus datos</li>
            </ul>
            <p className="text-foreground/70">
              Para ejercer estos derechos, contacta a{' '}
              <a href="mailto:holaaanxo@gmail.com" className="text-primary hover:underline">
                holaaanxo@gmail.com
              </a>
            </p>
          </section>

          {/* Retención */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              7. Retención de datos
            </h2>
            <div className="text-foreground/70 space-y-2">
              <p>Conservamos tus datos hasta que decidas darte de baja.</p>
              <p>Todos los emails incluyen un enlace para darse de baja automáticamente.</p>
            </div>
          </section>

          {/* Transferencias */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              8. Transferencias internacionales
            </h2>
            <p className="text-foreground/70">
              MailerLite puede procesar datos en servidores ubicados fuera del Espacio Económico Europeo. 
              Estas transferencias se realizan con las garantías adecuadas conforme al RGPD.
            </p>
          </section>

          {/* Seguridad */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              9. Medidas de seguridad
            </h2>
            <ul className="text-foreground/70 space-y-2 list-disc list-inside">
              <li>Conexión segura mediante HTTPS</li>
              <li>Proveedores certificados con altos estándares de seguridad (MailerLite)</li>
              <li>Acceso restringido a los datos personales</li>
            </ul>
          </section>

          {/* Contacto */}
          <section className="pt-8 border-t border-foreground/10">
            <p className="text-foreground/50 text-sm">
              Si tienes alguna pregunta sobre esta política de privacidad, puedes contactarnos en{' '}
              <a href="mailto:holaaanxo@gmail.com" className="text-primary hover:underline">
                holaaanxo@gmail.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
