export const faqSections = [
  {
    id: "pedidos",
    title: "Pedidos y productos",
    items: [
      {
        id: 1,
        heading: "¿Cómo sé si un producto es adecuado para mi piel o cabello?",
        body:
          "Cada producto tiene un objetivo específico dentro de la rutina de cuidado personal. Si tienes dudas sobre qué opción elegir, puedes escribirnos desde la página de contacto y te ayudaremos a identificar alternativas según tu necesidad principal, por ejemplo hidratación, firmeza facial, control de daño o cuidado capilar.",
        expanded: true,
      },
      {
        id: 2,
        heading: "¿Los productos son originales y nuevos?",
        body:
          "Sí. Trabajamos para ofrecer productos nuevos, cuidadosamente seleccionados y presentados con información clara para que puedas comprar con mayor confianza.",
        expanded: false,
      },
      {
        id: 3,
        heading: "¿Puedo combinar varios productos en una misma compra?",
        body:
          "Sí. Puedes añadir varios productos al carrito y completar tu pedido en una sola compra, sujeto a disponibilidad al momento del pago.",
        expanded: false,
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos y atención",
    items: [
      {
        id: 1,
        heading: "¿Hacen envíos y cómo puedo dar seguimiento a mi pedido?",
        body:
          "Sí. Una vez confirmado tu pedido, recibirás la información disponible para dar seguimiento al envío. Si necesitas apoyo adicional, nuestro equipo puede orientarte por correo o desde la sección de contacto.",
        expanded: true,
      },
      {
        id: 2,
        heading: "¿En cuánto tiempo responden las consultas?",
        body:
          "Buscamos responder lo antes posible durante horario operativo. Si nos dejas tu mensaje con los datos completos del pedido o de la consulta, la atención es más ágil.",
        expanded: false,
      },
      {
        id: 3,
        heading: "¿Puedo pedir ayuda antes de comprar?",
        body:
          "Sí. Si no estás seguro de qué producto elegir, puedes escribirnos antes de finalizar tu compra y con gusto te orientamos.",
        expanded: false,
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y seguridad",
    items: [
      {
        id: 1,
        heading: "¿Qué métodos de pago aceptan?",
        body:
          "Actualmente mostramos opciones como Visa, MasterCard y Amex. La disponibilidad final depende del proceso de pago activo en el sitio al momento de completar tu compra.",
        expanded: true,
      },
      {
        id: 2,
        heading: "¿Es seguro comprar en el sitio?",
        body:
          "Sí. Procuramos mantener un proceso de compra claro y seguro para proteger la información necesaria durante el pago y la gestión del pedido.",
        expanded: false,
      },
      {
        id: 3,
        heading: "¿Puedo solicitar ayuda si mi pago no se refleja?",
        body:
          "Sí. Si tienes algún problema con el pago o no ves la confirmación de tu compra, contáctanos con tu nombre y correo para revisarlo contigo.",
        expanded: false,
      },
    ],
  },
];

export default function Faq() {
  return (
    <section className="container mw-930 lh-30">
      <h2 className="section-title text-uppercase fw-bold mb-3">
        PREGUNTAS FRECUENTES
      </h2>
      <p className="mb-5 fs-6">
        Aquí encontrarás respuestas rápidas sobre productos, envíos, pagos y
        atención. Si aún tienes dudas, puedes escribirnos desde la página de
        contacto.
      </p>

      {faqSections.map((section) => (
        <div key={section.id} className="mb-5">
          <h3 className="mb-4">{section.title}</h3>
          <div
            id={`faq_accordion_${section.id}`}
            className="faq-accordion accordion"
          >
            {section.items.map((item) => (
              <div key={item.id} className="accordion-item">
                <h5
                  className="accordion-header"
                  id={`faq-${section.id}-heading-${item.id}`}
                >
                  <button
                    className={`accordion-button ${
                      !item.expanded ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${section.id}-collapse-${item.id}`}
                    aria-expanded={item.expanded}
                    aria-controls={`faq-${section.id}-collapse-${item.id}`}
                  >
                    {item.heading}
                    <svg className="accordion-button__icon" viewBox="0 0 14 14">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path
                          className="svg-path-vertical"
                          d="M14,6 L14,8 L0,8 L0,6 L14,6"
                        ></path>
                        <path
                          className="svg-path-horizontal"
                          d="M14,6 L14,8 L0,8 L0,6 L14,6"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </h5>
                <div
                  id={`faq-${section.id}-collapse-${item.id}`}
                  className={`accordion-collapse collapse ${
                    item.expanded ? "show" : ""
                  }`}
                  aria-labelledby={`faq-${section.id}-heading-${item.id}`}
                  data-bs-parent={`#faq_accordion_${section.id}`}
                >
                  <div className="accordion-body">
                    <p>{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
