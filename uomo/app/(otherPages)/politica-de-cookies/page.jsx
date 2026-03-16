import Footer14 from "@/components/footers/Footer14";
import Header1 from "@/components/headers/Header1";
import LegalLayout from "@/components/otherPages/LegalLayout";
import React from "react";

export const metadata = {
  title: "Política de Cookies | Elite 7 Piel",
  description:
    "Consulta la Política de Cookies de Elite 7 Piel para conocer qué tecnologías se utilizan, con qué fines y cómo puedes administrarlas.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <LegalLayout
          title="Política de Cookies"
          intro="Esta Política de Cookies explica qué tecnologías de seguimiento puede utilizar ELITE 7 PIEL en elite7piel.com, con qué finalidades se emplean y cómo puedes administrarlas desde tu navegador o dispositivo."
        >
          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son archivos de texto que un sitio web almacena en tu
            navegador o dispositivo para recordar información sobre tu visita.
            También pueden utilizarse tecnologías similares, como píxeles,
            identificadores o almacenamiento local.
          </p>

          <h2>2. ¿Qué tipos de cookies pueden utilizarse?</h2>
          <ul>
            <li>
              <strong>Cookies necesarias:</strong> permiten funciones básicas
              del sitio, como navegación, seguridad, carrito o sesión.
            </li>
            <li>
              <strong>Cookies de preferencias:</strong> recuerdan idioma,
              moneda, configuraciones u opciones de navegación.
            </li>
            <li>
              <strong>Cookies analíticas:</strong> ayudan a entender cómo se
              usa el sitio para mejorar rendimiento y experiencia.
            </li>
            <li>
              <strong>Cookies publicitarias o de medición:</strong> pueden
              utilizarse para personalizar campañas y medir resultados.
            </li>
          </ul>

          <h2>3. Finalidades de uso</h2>
          <p>Estas tecnologías pueden utilizarse para:</p>
          <ul>
            <li>Permitir el funcionamiento correcto del sitio.</li>
            <li>Recordar tus preferencias y configuraciones.</li>
            <li>Medir tráfico, rendimiento y comportamiento de navegación.</li>
            <li>Prevenir fraudes y reforzar la seguridad.</li>
            <li>Mejorar contenidos, campañas y experiencia de compra.</li>
          </ul>

          <h2>4. Cookies de terceros</h2>
          <p>
            Algunas cookies o tecnologías similares pueden ser gestionadas por
            terceros que prestan servicios tecnológicos, analíticos, de pago,
            publicidad o atención. El tratamiento realizado por esos terceros se
            rige además por sus propias políticas.
          </p>

          <h2>5. Cómo desactivar o administrar cookies</h2>
          <p>
            Puedes limitar, bloquear o eliminar cookies desde la configuración
            de tu navegador. Ten en cuenta que algunas funciones del sitio
            podrían dejar de operar correctamente si desactivas ciertas cookies
            necesarias.
          </p>

          <h2>6. Relación con el Aviso de Privacidad</h2>
          <p>
            Esta política complementa el{" "}
            <a href="/aviso-de-privacidad">Aviso de Privacidad</a> de ELITE 7
            PIEL, donde se describe el tratamiento general de datos personales,
            los derechos ARCO y los medios de contacto.
          </p>

          <h2>7. Contacto y cambios</h2>
          <p>
            Si tienes dudas sobre esta política puedes escribir a{" "}
            <a href="mailto:victor.velazquez@elite7piel.com">
              victor.velazquez@elite7piel.com
            </a>
            . Esta política puede actualizarse en cualquier momento y la versión
            vigente estará disponible en esta misma ruta.
          </p>
        </LegalLayout>
      </main>
      <Footer14 />
    </>
  );
}
