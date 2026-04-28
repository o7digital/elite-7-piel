import Footer14 from "@/components/footers/Footer14";
import Header1 from "@/components/headers/Header1";
import LegalLayout from "@/components/otherPages/LegalLayout";
import React from "react";

export const metadata = {
  title: "Impuestos y Aranceles | Elite 7 Piel",
  description:
    "Consulta la politica de Impuestos y Aranceles de Elite 7 Piel para pedidos internacionales y cargos de importacion.",
};

const responsibleDetails = [
  { label: "Marca", value: "ELITE 7 PIEL" },
  { label: "Responsable", value: "Victor Manuel Velazquez Perez" },
  { label: "Correo", value: "victor.velazquez@elite7piel.com" },
  { label: "Dominio", value: "elite7piel.com" },
];

const addressNotice =
  "Los cargos de importacion, impuestos locales o aranceles aplicables dependen del pais de destino y de sus autoridades aduaneras.";

export default function TaxesAndDutiesPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <LegalLayout
          title="Impuestos y Aranceles de Importacion"
          intro="ELITE 7 PIEL opera como minorista en linea con envios internacionales. Dependiendo del pais de destino, los pedidos pueden estar sujetos a impuestos o cargos aduanales."
          details={responsibleDetails}
          notice={addressNotice}
        >
          <h2>1. Cargos no incluidos</h2>
          <p>
            Salvo indicacion expresa, los precios publicados no incluyen
            aranceles de importacion, IVA local, cargos aduanales ni otras
            tasas gubernamentales aplicables en el pais de destino.
          </p>

          <h2>2. Responsabilidad del cliente</h2>
          <p>
            Cualquier impuesto, arancel o cargo adicional exigido por aduanas o
            transportistas es responsabilidad exclusiva del cliente al momento
            de la entrega o liberacion del pedido.
          </p>

          <h2>3. Pedidos a Estados Unidos</h2>
          <p>
            Los pedidos enviados a Estados Unidos pueden no estar sujetos a
            Sales Tax en ciertos casos, salvo que la ley aplicable disponga lo
            contrario.
          </p>

          <h2>4. Pedidos a Mexico</h2>
          <p>
            Los pedidos entregados en Mexico pueden estar sujetos a impuestos de
            importacion o IVA determinados por autoridades aduaneras o por el
            transportista al momento de la entrega.
          </p>

          <h2>5. Sin control sobre cargos externos</h2>
          <p>
            ELITE 7 PIEL no controla estos cargos ni puede garantizar de forma
            anticipada su monto exacto, ya que dependen de normativas y
            procesos de terceros.
          </p>
        </LegalLayout>
      </main>
      <Footer14 />
    </>
  );
}
