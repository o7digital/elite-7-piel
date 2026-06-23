export const faqSections = [
  {
    id: "productos",
    title: {
      es: "Productos y cuidado personal",
      en: "Products and personal care",
    },
    items: [
      {
        id: 1,
        heading: {
          es: "¿Cómo sé si un producto es adecuado para mi piel o cabello?",
          en: "How do I know if a product is right for my skin or hair?",
        },
        body: {
          es:
            "Cada producto tiene un objetivo específico dentro de la rutina de cuidado personal. Si tienes dudas sobre qué opción elegir, puedes escribirnos desde la página de contacto y te ayudaremos a identificar alternativas según tu necesidad principal, por ejemplo hidratación, firmeza facial, control de daño o cuidado capilar.",
          en:
            "Each product has a specific role within a personal care routine. If you are not sure which option to choose, contact us and we will help you identify alternatives based on your main need, such as hydration, facial firmness, damage control, or hair care.",
        },
      },
      {
        id: 2,
        heading: {
          es: "¿Los productos son originales y nuevos?",
          en: "Are the products original and new?",
        },
        body: {
          es:
            "Sí. En ELITE 7 PIEL trabajamos para ofrecer productos nuevos, cuidadosamente seleccionados y presentados con información clara para que puedas comprar con mayor confianza.",
          en:
            "Yes. At ELITE 7 PIEL we work to offer new, carefully selected products with clear information so you can shop with greater confidence.",
        },
      },
      {
        id: 3,
        heading: {
          es: "¿Puedo pedir ayuda antes de comprar?",
          en: "Can I ask for help before buying?",
        },
        body: {
          es:
            "Sí. Si no estás seguro de qué producto elegir, puedes escribirnos antes de finalizar tu compra y con gusto te orientamos.",
          en:
            "Yes. If you are not sure which product to choose, you can write to us before completing your purchase and we will gladly guide you.",
        },
      },
    ],
  },
  {
    id: "pedidos",
    title: {
      es: "Pedidos y envíos",
      en: "Orders and shipping",
    },
    items: [
      {
        id: 1,
        heading: {
          es: "¿Puedo combinar varios productos en una misma compra?",
          en: "Can I combine several products in one purchase?",
        },
        body: {
          es:
            "Sí. Puedes añadir varios productos al carrito y completar tu pedido en una sola compra, sujeto a disponibilidad al momento del pago.",
          en:
            "Yes. You can add several products to the cart and complete your order in a single purchase, subject to availability at checkout.",
        },
      },
      {
        id: 2,
        heading: {
          es: "¿Hacen envíos y cómo puedo dar seguimiento a mi pedido?",
          en: "Do you ship orders and how can I track mine?",
        },
        body: {
          es:
            "Sí. Una vez confirmado tu pedido, recibirás la información disponible para dar seguimiento al envío. Si necesitas apoyo adicional, nuestro equipo puede orientarte por correo o desde la sección de contacto.",
          en:
            "Yes. Once your order is confirmed, you will receive the available information to track the shipment. If you need additional support, our team can help by email or through the contact section.",
        },
      },
      {
        id: 3,
        heading: {
          es: "¿En cuánto tiempo responden las consultas?",
          en: "How quickly do you answer questions?",
        },
        body: {
          es:
            "Buscamos responder lo antes posible durante horario operativo. Si nos dejas tu mensaje con los datos completos del pedido o de la consulta, la atención es más ágil.",
          en:
            "We aim to respond as soon as possible during business hours. If you send your message with complete order or inquiry details, we can help you faster.",
        },
      },
    ],
  },
  {
    id: "pagos",
    title: {
      es: "Pagos y seguridad",
      en: "Payments and security",
    },
    items: [
      {
        id: 1,
        heading: {
          es: "¿Qué métodos de pago aceptan?",
          en: "What payment methods do you accept?",
        },
        body: {
          es:
            "Actualmente mostramos opciones como Visa, MasterCard y Amex. La disponibilidad final depende del proceso de pago activo en el sitio al momento de completar tu compra.",
          en:
            "We currently show options such as Visa, MasterCard, and Amex. Final availability depends on the active checkout process on the site when you complete your purchase.",
        },
      },
      {
        id: 2,
        heading: {
          es: "¿Es seguro comprar en el sitio?",
          en: "Is it safe to buy on the site?",
        },
        body: {
          es:
            "Sí. Procuramos mantener un proceso de compra claro y seguro para proteger la información necesaria durante el pago y la gestión del pedido.",
          en:
            "Yes. We work to keep the purchase process clear and secure to protect the information needed for payment and order management.",
        },
      },
      {
        id: 3,
        heading: {
          es: "¿Puedo solicitar ayuda si mi pago no se refleja?",
          en: "Can I request help if my payment does not appear?",
        },
        body: {
          es:
            "Sí. Si tienes algún problema con el pago o no ves la confirmación de tu compra, contáctanos con tu nombre y correo para revisarlo contigo.",
          en:
            "Yes. If you have a payment issue or do not see your purchase confirmation, contact us with your name and email so we can review it with you.",
        },
      },
    ],
  },
];

export function getFaqSections(locale = "es") {
  return faqSections.map((section) => ({
    ...section,
    title: section.title[locale] || section.title.es,
    items: section.items.map((item) => ({
      ...item,
      heading: item.heading[locale] || item.heading.es,
      body: item.body[locale] || item.body.es,
    })),
  }));
}
