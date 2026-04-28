import Footer14 from "@/components/footers/Footer14";
import Header1 from "@/components/headers/Header1";
import LegalLayout from "@/components/otherPages/LegalLayout";
import React from "react";

export const metadata = {
  title: "Politica de Envios | Elite 7 Piel",
  description:
    "Consulta la Politica de Envios de Elite 7 Piel, incluyendo tiempos de entrega, procesamiento y responsabilidades de envio.",
};

const responsibleDetails = [
  { label: "Marca", value: "ELITE 7 PIEL" },
  { label: "Responsable", value: "Victor Manuel Velazquez Perez" },
  { label: "Correo", value: "victor.velazquez@elite7piel.com" },
  { label: "Dominio", value: "elite7piel.com" },
];

const addressNotice =
  "Si tienes dudas sobre el estado de tu envio o necesitas apoyo adicional, puedes escribirnos a victor.velazquez@elite7piel.com.";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <LegalLayout
          title="Politica de Envios"
          intro="En ELITE 7 PIEL realizamos envios internacionales con socios logisticos de confianza. Los productos pueden despacharse desde centros de cumplimiento ubicados fuera del pais de destino."
          details={responsibleDetails}
          notice={addressNotice}
        >
          <h2>1. Tiempos de envio</h2>
          <p>
            Los plazos estimados de entrega son de 10 a 20 dias habiles,
            dependiendo del destino, procesos aduanales y operacion del
            transportista.
          </p>
          <p>
            Estos tiempos son estimaciones y pueden variar por factores fuera
            de nuestro control, incluyendo temporadas altas, condiciones
            climaticas o incidencias operativas.
          </p>

          <h2>2. Procesamiento de pedidos</h2>
          <p>
            Los pedidos se procesan normalmente dentro de 2 a 5 dias habiles
            antes del envio.
          </p>
          <p>
            Cuando el pedido sea despachado, compartiremos numero de rastreo
            cuando este disponible por parte del transportista.
          </p>

          <h2>3. Responsabilidad de envio</h2>
          <p>
            Una vez que el pedido ha sido entregado al transportista, ELITE 7
            PIEL no se hace responsable de retrasos, retenciones aduanales o
            incidencias de entrega atribuibles al transportista, autoridades
            aduaneras o informacion incorrecta proporcionada por el cliente.
          </p>

          <h2>4. Direccion de entrega</h2>
          <p>
            Es responsabilidad del cliente proporcionar datos completos y
            correctos de entrega. En caso de errores en la direccion, pueden
            generarse demoras, costos adicionales o devoluciones al origen.
          </p>

          <h2>5. Contacto para soporte</h2>
          <p>
            Para dudas sobre envios, rastreo o incidencias, puedes escribir a{" "}
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
