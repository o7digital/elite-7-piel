import Footer14 from "@/components/footers/Footer14";
import Header1 from "@/components/headers/Header1";
import LegalLayout from "@/components/otherPages/LegalLayout";
import React from "react";

export const metadata = {
  title: "Aviso de Privacidad | Elite 7 Piel",
  description:
    "Consulta el Aviso de Privacidad de Elite 7 Piel, incluyendo tratamiento de datos personales, cookies, derechos ARCO y medios de contacto.",
};

const responsibleDetails = [
  { label: "Marca", value: "ELITE 7 PIEL" },
  { label: "Responsable", value: "Victor Manuel Velazquez PEREZ" },
  { label: "RFC", value: "VEPV950228TLA" },
  {
    label: "Correo",
    value: "victor.velazquez@elite7piel.com",
  },
  { label: "Dominio", value: "elite7piel.com" },
];

const addressNotice =
  "Domicilio para efectos de atención de solicitudes relacionadas con datos personales:\n[PENDIENTE: insertar domicilio comercial, fiscal o de correspondencia del responsable]";

export default function AvisoDePrivacidadPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <LegalLayout
          title="Aviso de Privacidad"
          intro="En ELITE 7 PIEL reconocemos la importancia de proteger tus datos personales. Este aviso describe qué información podemos recabar, con qué finalidades la utilizamos, cómo puedes ejercer tus derechos ARCO y qué medidas aplicamos para resguardar tu información."
          details={responsibleDetails}
          notice={addressNotice}
        >
          <h2>1. Datos personales que podemos recabar</h2>
          <p>
            Podemos recabar datos personales cuando navegas en el sitio, cuando
            realizas una compra, cuando te registras, cuando solicitas atención
            al cliente o cuando te suscribes a comunicaciones comerciales.
          </p>
          <ul>
            <li>Datos de identificación, como nombre completo.</li>
            <li>Datos de contacto, como correo electrónico y teléfono.</li>
            <li>Datos de compra, facturación, pedidos y preferencias.</li>
            <li>
              Datos técnicos de navegación, como dirección IP, navegador,
              dispositivo, páginas visitadas y cookies.
            </li>
          </ul>

          <h2>2. Finalidades del tratamiento</h2>
          <h3>Finalidades primarias</h3>
          <ul>
            <li>Procesar compras, pagos, envíos, devoluciones y aclaraciones.</li>
            <li>Dar seguimiento a pedidos y brindar atención al cliente.</li>
            <li>
              Verificar identidad, prevenir fraudes y proteger la seguridad del
              sitio.
            </li>
            <li>
              Cumplir obligaciones legales, fiscales, contractuales y de
              servicio.
            </li>
          </ul>

          <h3>Finalidades secundarias</h3>
          <ul>
            <li>
              Enviar promociones, novedades, recordatorios de carrito o
              comunicaciones comerciales.
            </li>
            <li>
              Mejorar nuestros productos, experiencia de usuario, campañas y
              contenidos.
            </li>
            <li>Realizar análisis estadísticos y medición de desempeño.</li>
          </ul>
          <p>
            Si no deseas que tus datos sean tratados para finalidades
            secundarias, puedes solicitarlo en cualquier momento al correo{" "}
            <a href="mailto:victor.velazquez@elite7piel.com">
              victor.velazquez@elite7piel.com
            </a>
            .
          </p>

          <h2>3. Derechos ARCO y revocación del consentimiento</h2>
          <p>
            Tienes derecho a acceder, rectificar, cancelar u oponerte al
            tratamiento de tus datos personales, así como a revocar el
            consentimiento que nos hayas otorgado para determinadas finalidades.
          </p>
          <p>
            Para ejercer tus derechos ARCO o solicitar la revocación del
            consentimiento, envía una solicitud al correo{" "}
            <a href="mailto:victor.velazquez@elite7piel.com">
              victor.velazquez@elite7piel.com
            </a>{" "}
            indicando:
          </p>
          <ul>
            <li>Nombre del titular.</li>
            <li>Medio de contacto para responder la solicitud.</li>
            <li>Descripción clara del derecho que deseas ejercer.</li>
            <li>
              En su caso, documentos o datos que ayuden a identificar tu
              información.
            </li>
          </ul>

          <h2>4. Transferencias de datos</h2>
          <p>
            Tus datos personales podrán ser compartidos únicamente cuando sea
            necesario para procesar pagos, logística, mensajería, hospedaje del
            sitio, herramientas tecnológicas o cumplimiento de obligaciones
            legales. En todos los casos procuramos que dichos terceros actúen
            bajo medidas razonables de confidencialidad y seguridad.
          </p>

          <h2>5. Cookies y tecnologías similares</h2>
          <p>
            Nuestro sitio puede utilizar cookies, etiquetas de seguimiento,
            píxeles u otras tecnologías similares para recordar preferencias,
            mejorar la experiencia de navegación, analizar el comportamiento del
            sitio y medir campañas. Para mayor detalle consulta nuestra{" "}
            <a href="/politica-de-cookies">Política de Cookies</a>.
          </p>

          <h2>6. Seguridad y conservación</h2>
          <p>
            Aplicamos medidas administrativas, técnicas y organizativas
            razonables para proteger los datos personales contra daño, pérdida,
            alteración, destrucción o uso no autorizado. Conservaremos la
            información únicamente durante el tiempo necesario para cumplir con
            las finalidades descritas y con las obligaciones aplicables.
          </p>

          <h2>7. Cambios al aviso</h2>
          <p>
            Este aviso puede actualizarse en cualquier momento por cambios
            legales, operativos o de negocio. Las modificaciones estarán
            disponibles en esta misma ruta:{" "}
            <a href="https://elite7piel.com/aviso-de-privacidad">
              elite7piel.com/aviso-de-privacidad
            </a>
            .
          </p>

          <h2>8. Contacto</h2>
          <p>
            Si tienes dudas sobre este Aviso de Privacidad o sobre el
            tratamiento de tus datos personales, puedes escribir a{" "}
            <a href="mailto:victor.velazquez@elite7piel.com">
              victor.velazquez@elite7piel.com
            </a>
            .
          </p>
        </LegalLayout>
      </main>
      <Footer14 />
    </>
  );
}
