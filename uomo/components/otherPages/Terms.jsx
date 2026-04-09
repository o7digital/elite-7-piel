import React from "react";

const sections = [
  {
    title: "Uso del sitio",
    body: "Al navegar por ELITE 7 PIEL aceptas utilizar el sitio de forma licita, sin afectar su funcionamiento, su seguridad ni la experiencia de otros usuarios. La informacion publicada tiene fines comerciales e informativos y puede actualizarse sin previo aviso.",
  },
  {
    title: "Informacion de productos",
    body: "Nos esforzamos por mostrar descripciones, imagenes, beneficios y precios con la mayor precision posible. Aun asi, algunos detalles visuales pueden variar ligeramente segun disponibilidad, presentacion del fabricante o actualizaciones del catalogo.",
  },
  {
    title: "Pedidos y confirmacion",
    body: "La recepcion de un pedido no implica su aceptacion definitiva. ELITE 7 PIEL puede validar existencias, datos de contacto y condiciones de pago antes de confirmar el envio. Si surge alguna incidencia, nuestro equipo se pondra en contacto contigo por correo o WhatsApp.",
  },
  {
    title: "Pagos y promociones",
    body: "Los precios, descuentos y promociones pueden cambiar sin previo aviso. Las ofertas aplican exclusivamente durante su vigencia y bajo las condiciones indicadas en cada campana. Los cargos finales se muestran antes de concluir la compra.",
  },
  {
    title: "Envios y tiempos de entrega",
    body: "Los tiempos de entrega pueden variar segun la ubicacion, la paqueteria y la disponibilidad de producto. Una vez confirmado el pedido, te compartiremos el seguimiento cuando aplique. Los retrasos atribuibles a terceros pueden modificar la fecha estimada de entrega.",
  },
  {
    title: "Atencion y responsabilidad",
    body: "Si necesitas apoyo con un producto, pedido o recomendacion de uso, puedes contactarnos por nuestros canales oficiales. ELITE 7 PIEL no sera responsable por danos indirectos derivados del uso inadecuado del sitio o de la interpretacion individual de la informacion publicada.",
  },
];

export default function Terms() {
  return (
    <section className="container mw-930 lh-30">
      <h1 className="section-title text-uppercase fw-bold mb-5">
        Terminos y condiciones
      </h1>
      <p className="mb-4 pb-3">
        Estos terminos regulan el acceso, la navegacion y la compra de
        productos en ELITE 7 PIEL. Te recomendamos leerlos antes de realizar un
        pedido o utilizar cualquiera de nuestros canales digitales.
      </p>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-3 fs-5 fw-bold">{section.title}</h2>
          <p className="mb-4 pb-3">{section.body}</p>
        </div>
      ))}
    </section>
  );
}
