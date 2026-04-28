import { seoKeywordContent } from "@/data/seoKeywordContent";
import { spanishTranslations } from "./es";

function invertEntries(entries = {}) {
  return Object.fromEntries(
    Object.entries(entries)
      .filter(([source, target]) => source && target && source !== target)
      .map(([source, target]) => [target, source])
  );
}

function buildSeoKeywordEntries() {
  const exactEntries = {
    [seoKeywordContent.sectionLabelEs]: seoKeywordContent.sectionLabelEn,
    [seoKeywordContent.headingEs]: seoKeywordContent.headingEn,
    [seoKeywordContent.introEs]: seoKeywordContent.introEn,
  };

  seoKeywordContent.sections.forEach((section) => {
    exactEntries[section.esTitle] = section.enTitle;
    exactEntries[section.esBody] = section.enBody;

    section.esKeywords.forEach((keyword, index) => {
      exactEntries[keyword] = section.enKeywords[index] || keyword;
    });
  });

  return exactEntries;
}

const manualExact = {
  "Cuidado facial y capilar profesional | ELITE 7 PIEL":
    "Professional facial and hair care | ELITE 7 PIEL",
  "Compra productos de cuidado facial, tecnologia estetica en casa y tratamiento capilar profesional en ELITE 7 PIEL.":
    "Shop facial care products, at-home beauty devices, and professional hair treatments at ELITE 7 PIEL.",
  "Tienda online de cuidado facial, tecnologia estetica y tratamiento capilar profesional.":
    "Online store for facial care, beauty technology, and professional hair treatment.",
  "Cuidado facial y capilar profesional | Professional facial and hair care | ELITE 7 PIEL":
    "Professional facial and hair care | ELITE 7 PIEL",
  "Compra cremas antiarrugas efectivas, radiofrecuencia facial en casa, tratamiento capilar intensivo y productos de belleza originales.":
    "Buy effective anti-aging creams, at-home facial radiofrequency devices, intensive hair treatments, and original beauty products online.",
  "Compra cremas antiarrugas efectivas, radiofrecuencia facial en casa, tratamiento capilar intensivo y productos de belleza originales. Buy anti-aging creams, facial devices, intensive hair care and original beauty products online.":
    "Buy effective anti-aging creams, at-home facial radiofrequency devices, intensive hair treatments, and original beauty products online.",
  "Tienda de cuidado facial y capilar | Facial and hair care store | ELITE 7 PIEL":
    "Facial and hair care store | ELITE 7 PIEL",
  "Tienda de cuidado facial y capilar | ELITE 7 PIEL":
    "Facial and hair care store | ELITE 7 PIEL",
  "Encuentra cremas para rejuvenecer la piel, aparatos antiarrugas, productos profesionales para el cabello y belleza online.":
    "Find skin-rejuvenating creams, anti-wrinkle devices, professional hair products, and beauty essentials online.",
  "Encuentra cremas para rejuvenecer la piel, aparatos antiarrugas, productos profesionales para el cabello y belleza online. Discover skin rejuvenation creams, anti-wrinkle devices and professional beauty products.":
    "Find skin-rejuvenating creams, anti-wrinkle devices, professional hair products, and beauty essentials online.",
  "Colecciones y catalogo de belleza": "Beauty collections and catalog",
  "Vista complementaria del catalogo y las colecciones de cuidado facial, capilar y belleza profesional de ELITE 7 PIEL.":
    "Additional view of ELITE 7 PIEL's facial care, hair care, and professional beauty catalog and collections.",
  "Variantes de catalogo y colecciones": "Catalog and collection variants",
  "Explora variaciones de listado de productos y colecciones de belleza, cuidado facial y tratamiento capilar de ELITE 7 PIEL.":
    "Explore product listing variations plus beauty, facial care, and hair treatment collections from ELITE 7 PIEL.",
  "Detalle de producto y variantes de compra": "Product details and purchase variants",
  "Consulta variantes de fichas de producto, rutinas de belleza y opciones de compra dentro del catalogo de ELITE 7 PIEL.":
    "Review product detail variants, beauty routines, and purchase options inside the ELITE 7 PIEL catalog.",
  "Blog de belleza, piel y cabello": "Beauty, skin, and hair blog",
  "Lee articulos y consejos sobre cuidado facial, tratamiento capilar, rutinas de belleza y tecnologia estetica en ELITE 7 PIEL.":
    "Read articles and tips about facial care, hair treatment, beauty routines, and beauty technology at ELITE 7 PIEL.",
  "Acceso y gestion de cuenta": "Account access and management",
  "Area privada para gestionar pedidos, direcciones, favoritos y datos de tu cuenta en ELITE 7 PIEL.":
    "Private area to manage orders, addresses, favorites, and your account details at ELITE 7 PIEL.",
  "Acceso a tu cuenta": "Access your account",
  "Inicia sesion o crea tu cuenta para gestionar pedidos, favoritos y datos personales en ELITE 7 PIEL.":
    "Sign in or create your account to manage orders, favorites, and personal information at ELITE 7 PIEL.",
  "Recuperar contrasena": "Recover password",
  "Restablece el acceso a tu cuenta de ELITE 7 PIEL de forma segura.":
    "Restore access to your ELITE 7 PIEL account securely.",
  "Lookbook de belleza y cuidado personal":
    "Beauty and personal care lookbook",
  "Descubre una seleccion visual de productos, estilos y rutinas de cuidado facial, capilar y belleza en ELITE 7 PIEL.":
    "Discover a visual selection of products, styles, and facial, hair, and beauty routines at ELITE 7 PIEL.",
  "Terminos y condiciones": "Terms and conditions",
  "Consulta los terminos y condiciones de uso, compra, pagos y servicio aplicables en ELITE 7 PIEL.":
    "Review the terms and conditions for use, purchases, payments, and service at ELITE 7 PIEL.",
  "Ubicacion y atencion": "Location and support",
  "Consulta informacion de ubicacion, contacto y atencion relacionada con ELITE 7 PIEL.":
    "Review location, contact, and support information related to ELITE 7 PIEL.",
  "Proximamente": "Coming soon",
  "Pagina temporal de proximos lanzamientos y novedades de ELITE 7 PIEL.":
    "Temporary page for upcoming launches and news from ELITE 7 PIEL.",
  "Pagina no encontrada": "Page not found",
  "La pagina que buscas no esta disponible. Explora el catalogo y las secciones principales de ELITE 7 PIEL.":
    "The page you are looking for is not available. Explore the catalog and main sections of ELITE 7 PIEL.",
  "Carrito de compra": "Shopping cart",
  "Revision temporal de productos agregados al carrito antes de finalizar la compra en ELITE 7 PIEL.":
    "Temporary review of products added to the cart before completing your ELITE 7 PIEL purchase.",
  "Checkout y envio": "Checkout and shipping",
  "Proceso temporal de envio y pago para completar tu compra en ELITE 7 PIEL.":
    "Temporary shipping and payment flow to complete your ELITE 7 PIEL purchase.",
  "Orden recibida": "Order received",
  "Confirmacion temporal posterior a la compra en ELITE 7 PIEL.":
    "Temporary confirmation shown after a purchase at ELITE 7 PIEL.",
  "Seguimiento de pedido": "Order tracking",
  "Consulta temporal del estado de un pedido realizado en ELITE 7 PIEL.":
    "Temporary status view for an order placed at ELITE 7 PIEL.",
  "Quienes Somos | Elite 7 Piel": "About Us | Elite 7 Piel",
  "Conoce Elite 7 Piel, nuestra historia, compromiso y enfoque en productos de belleza, cuidado capilar y bienestar.":
    "Learn about Elite 7 Piel, our story, commitment, and focus on beauty products, hair care, and wellbeing.",
  "Preguntas Frecuentes | ELITE 7 PIEL":
    "Frequently Asked Questions | ELITE 7 PIEL",
  "Resuelve tus dudas sobre productos, pedidos, pagos y atención en ELITE 7 PIEL.":
    "Resolve your questions about products, orders, payments, and support at ELITE 7 PIEL.",
  "Contacto || ELITE 7 PIEL": "Contact || ELITE 7 PIEL",
  "Contacto ELITE 7 PIEL": "Contact ELITE 7 PIEL",
  "Aviso de Privacidad | Elite 7 Piel":
    "Privacy Notice | Elite 7 Piel",
  "Consulta el Aviso de Privacidad de Elite 7 Piel, incluyendo tratamiento de datos personales, cookies, derechos ARCO y medios de contacto.":
    "Review the Elite 7 Piel Privacy Notice, including personal data handling, cookies, ARCO rights, and contact channels.",
  "Política de Cookies | Elite 7 Piel": "Cookie Policy | Elite 7 Piel",
  "Consulta la Política de Cookies de Elite 7 Piel para conocer qué tecnologías se utilizan, con qué fines y cómo puedes administrarlas.":
    "Review the Elite 7 Piel Cookie Policy to learn what technologies are used, why they are used, and how you can manage them.",
  "Politica de Envios | Elite 7 Piel": "Shipping Policy | Elite 7 Piel",
  "Consulta la Politica de Envios de Elite 7 Piel, incluyendo tiempos de entrega, procesamiento y responsabilidades de envio.":
    "Review Elite 7 Piel's Shipping Policy, including delivery times, processing, and shipping responsibilities.",
  "Impuestos y Aranceles | Elite 7 Piel":
    "Taxes and Duties | Elite 7 Piel",
  "Consulta la politica de Impuestos y Aranceles de Elite 7 Piel para pedidos internacionales y cargos de importacion.":
    "Review Elite 7 Piel's Taxes and Duties policy for international orders and import charges.",
  "Politica de Envios": "Shipping Policy",
  "En ELITE 7 PIEL realizamos envios internacionales con socios logisticos de confianza. Los productos pueden despacharse desde centros de cumplimiento ubicados fuera del pais de destino.":
    "At ELITE 7 PIEL, we ship internationally through trusted logistics partners. Products may be dispatched from fulfillment centers located outside the destination country.",
  "Si tienes dudas sobre el estado de tu envio o necesitas apoyo adicional, puedes escribirnos a victor.velazquez@elite7piel.com.":
    "If you have questions about your shipment status or need additional support, you can contact us at victor.velazquez@elite7piel.com.",
  "1. Tiempos de envio": "1. Shipping times",
  "Los plazos estimados de entrega son de 10 a 20 dias habiles, dependiendo del destino, procesos aduanales y operacion del transportista.":
    "Estimated delivery times are 10 to 20 business days, depending on destination, customs processing, and carrier operations.",
  "Estos tiempos son estimaciones y pueden variar por factores fuera de nuestro control, incluyendo temporadas altas, condiciones climaticas o incidencias operativas.":
    "These timelines are estimates and may vary due to factors beyond our control, including peak seasons, weather conditions, or operational incidents.",
  "2. Procesamiento de pedidos": "2. Order processing",
  "Los pedidos se procesan normalmente dentro de 2 a 5 dias habiles antes del envio.":
    "Orders are typically processed within 2 to 5 business days before shipment.",
  "Cuando el pedido sea despachado, compartiremos numero de rastreo cuando este disponible por parte del transportista.":
    "Once the order is dispatched, we will share a tracking number when available from the carrier.",
  "3. Responsabilidad de envio": "3. Shipping responsibility",
  "Una vez que el pedido ha sido entregado al transportista, ELITE 7 PIEL no se hace responsable de retrasos, retenciones aduanales o incidencias de entrega atribuibles al transportista, autoridades aduaneras o informacion incorrecta proporcionada por el cliente.":
    "Once an order has been handed to the carrier, ELITE 7 PIEL is not responsible for delays, customs holds, or delivery issues caused by the carrier, customs authorities, or incorrect information provided by the customer.",
  "4. Direccion de entrega": "4. Delivery address",
  "Es responsabilidad del cliente proporcionar datos completos y correctos de entrega. En caso de errores en la direccion, pueden generarse demoras, costos adicionales o devoluciones al origen.":
    "The customer is responsible for providing complete and accurate delivery details. Address errors may cause delays, additional costs, or returns to origin.",
  "5. Contacto para soporte": "5. Support contact",
  "Para dudas sobre envios, rastreo o incidencias, puedes escribir a":
    "For questions about shipping, tracking, or incidents, you can contact ",
  "Impuestos y Aranceles de Importacion":
    "Import Taxes and Duties",
  "ELITE 7 PIEL opera como minorista en linea con envios internacionales. Dependiendo del pais de destino, los pedidos pueden estar sujetos a impuestos o cargos aduanales.":
    "ELITE 7 PIEL operates as an online retailer with international shipping. Depending on the destination country, orders may be subject to taxes or customs charges.",
  "Los cargos de importacion, impuestos locales o aranceles aplicables dependen del pais de destino y de sus autoridades aduaneras.":
    "Import charges, local taxes, or applicable duties depend on the destination country and its customs authorities.",
  "1. Cargos no incluidos": "1. Charges not included",
  "Salvo indicacion expresa, los precios publicados no incluyen aranceles de importacion, IVA local, cargos aduanales ni otras tasas gubernamentales aplicables en el pais de destino.":
    "Unless expressly stated, published prices do not include import duties, local VAT, customs fees, or other government charges applicable in the destination country.",
  "2. Responsabilidad del cliente": "2. Customer responsibility",
  "Cualquier impuesto, arancel o cargo adicional exigido por aduanas o transportistas es responsabilidad exclusiva del cliente al momento de la entrega o liberacion del pedido.":
    "Any tax, duty, or additional charge required by customs or carriers is the sole responsibility of the customer at delivery or release of the order.",
  "3. Pedidos a Estados Unidos": "3. Orders to the United States",
  "Los pedidos enviados a Estados Unidos pueden no estar sujetos a Sales Tax en ciertos casos, salvo que la ley aplicable disponga lo contrario.":
    "Orders shipped to the United States may not be subject to sales tax in certain cases, unless applicable law states otherwise.",
  "4. Pedidos a Mexico": "4. Orders to Mexico",
  "Los pedidos entregados en Mexico pueden estar sujetos a impuestos de importacion o IVA determinados por autoridades aduaneras o por el transportista al momento de la entrega.":
    "Orders delivered in Mexico may be subject to import taxes or VAT determined by customs authorities or by the carrier at the time of delivery.",
  "5. Sin control sobre cargos externos":
    "5. No control over external charges",
  "ELITE 7 PIEL no controla estos cargos ni puede garantizar de forma anticipada su monto exacto, ya que dependen de normativas y procesos de terceros.":
    "ELITE 7 PIEL does not control these charges and cannot guarantee their exact amount in advance, since they depend on third-party regulations and processes.",
  "QUIENES SOMOS": "ABOUT US",
  "Sala de reunion profesional": "Professional meeting room",
  "Nuestra historia": "Our story",
  "En Elite 7 Piel nos apasiona ayudar a las personas a cuidar su piel, su cabello y su bienestar con productos de belleza de alta calidad y tecnologia estetica pensada para la rutina diaria.":
    "At Elite 7 Piel, we are passionate about helping people care for their skin, hair, and wellbeing with high-quality beauty products and beauty technology designed for daily routines.",
  "Somos una empresa dedicada a ofrecer cremas especializadas, dispositivos electronicos para el rejuvenecimiento facial y tratamientos para el cuidado capilar. Nuestro objetivo es brindar soluciones innovadoras que ayuden a mejorar la apariencia y salud de la piel y el cabello, combinando tecnologia moderna con una seleccion cuidadosa de productos.":
    "We are a company focused on offering specialized creams, electronic devices for facial rejuvenation, and treatments for hair care. Our goal is to provide innovative solutions that help improve the appearance and health of skin and hair by combining modern technology with a carefully selected catalog.",
  "Creemos que el cuidado personal es una parte fundamental de la confianza y la autoestima. Por eso trabajamos constantemente para ofrecer opciones efectivas, seguras y accesibles, pensadas para quienes desean verse y sentirse mejor cada dia.":
    "We believe personal care is a core part of confidence and self-esteem. That is why we continuously work to offer effective, safe, and accessible options for people who want to look and feel better every day.",
  "Nuestra mision": "Our mission",
  "Acercar soluciones modernas de cuidado personal que aporten beneficios reales y se integren facilmente a la vida diaria de nuestros clientes.":
    "Bring modern personal care solutions closer to our customers, with real benefits and easy integration into everyday life.",
  "Nuestra vision": "Our vision",
  "Ser una marca de confianza en belleza y bienestar, reconocida por ofrecer productos que ayudan a lograr una piel saludable, un cabello fuerte y una imagen radiante.":
    "To be a trusted beauty and wellness brand, recognized for offering products that help achieve healthy skin, strong hair, and a radiant image.",
  "Compromiso Elite 7 Piel": "Elite 7 Piel commitment",
  "Nuestro compromiso": "Our commitment",
  "En Elite 7 Piel queremos acompanarte en el camino hacia una piel mas saludable, un cabello mas fuerte y una belleza que refleje bienestar y confianza. Mas que una tienda, buscamos ser tu aliado con opciones practicas, confiables y cuidadosamente seleccionadas para que puedas cuidar de ti desde la comodidad de tu hogar.":
    "At Elite 7 Piel, we want to support you on the path toward healthier skin, stronger hair, and beauty that reflects wellbeing and confidence. More than a store, we aim to be your ally with practical, reliable, and carefully selected options so you can care for yourself from the comfort of home.",
  "PRODUCTOS SELECCIONADOS": "SELECTED PRODUCTS",
  "Elegimos cremas, tratamientos y tecnologia estetica con enfoque en calidad, seguridad y uso practico.":
    "We select creams, treatments, and beauty technology with a focus on quality, safety, and practical use.",
  "ATENCION CERCANA": "CLOSE SUPPORT",
  "Acompanamos a cada cliente para ayudarle a encontrar opciones alineadas con su rutina y sus objetivos.":
    "We support every client to help them find options aligned with their routine and goals.",
  "BIENESTAR Y CONFIANZA": "WELLBEING AND CONFIDENCE",
  "Buscamos ofrecer soluciones que ayuden a verse mejor, sentirse bien y fortalecer la confianza personal.":
    "We aim to offer solutions that help you look better, feel good, and strengthen personal confidence.",
  "PREGUNTAS FRECUENTES": "FREQUENTLY ASKED QUESTIONS",
  "Aquí encontrarás respuestas rápidas sobre productos, envíos, pagos y atención. Si aún tienes dudas, puedes escribirnos desde la página de contacto.":
    "Here you will find quick answers about products, shipping, payments, and support. If you still have questions, you can contact us through the contact page.",
  "Pedidos y productos": "Orders and products",
  "¿Cómo sé si un producto es adecuado para mi piel o cabello?":
    "How do I know if a product is right for my skin or hair?",
  "Cada producto tiene un objetivo específico dentro de la rutina de cuidado personal. Si tienes dudas sobre qué opción elegir, puedes escribirnos desde la página de contacto y te ayudaremos a identificar alternativas según tu necesidad principal, por ejemplo hidratación, firmeza facial, control de daño o cuidado capilar.":
    "Each product has a specific role within a personal care routine. If you are unsure which option to choose, write to us from the contact page and we will help you identify alternatives based on your main need, such as hydration, facial firmness, damage control, or hair care.",
  "¿Los productos son originales y nuevos?":
    "Are the products original and new?",
  "Sí. Trabajamos para ofrecer productos nuevos, cuidadosamente seleccionados y presentados con información clara para que puedas comprar con mayor confianza.":
    "Yes. We work to offer new, carefully selected products with clear information so you can shop with greater confidence.",
  "¿Puedo combinar varios productos en una misma compra?":
    "Can I combine several products in one purchase?",
  "Sí. Puedes añadir varios productos al carrito y completar tu pedido en una sola compra, sujeto a disponibilidad al momento del pago.":
    "Yes. You can add several products to the cart and complete your order in a single purchase, subject to availability at checkout.",
  "Envíos y atención": "Shipping and support",
  "¿Hacen envíos y cómo puedo dar seguimiento a mi pedido?":
    "Do you ship, and how can I track my order?",
  "Sí. Una vez confirmado tu pedido, recibirás la información disponible para dar seguimiento al envío. Si necesitas apoyo adicional, nuestro equipo puede orientarte por correo o desde la sección de contacto.":
    "Yes. Once your order is confirmed, you will receive the available shipping tracking information. If you need extra help, our team can guide you by email or from the contact section.",
  "¿En cuánto tiempo responden las consultas?":
    "How quickly do you respond to inquiries?",
  "Buscamos responder lo antes posible durante horario operativo. Si nos dejas tu mensaje con los datos completos del pedido o de la consulta, la atención es más ágil.":
    "We aim to respond as quickly as possible during operating hours. If you leave your message with complete order or inquiry details, support is faster.",
  "¿Puedo pedir ayuda antes de comprar?":
    "Can I ask for help before buying?",
  "Sí. Si no estás seguro de qué producto elegir, puedes escribirnos antes de finalizar tu compra y con gusto te orientamos.":
    "Yes. If you are not sure which product to choose, you can write to us before completing your purchase and we will gladly guide you.",
  "Pagos y seguridad": "Payments and security",
  "¿Qué métodos de pago aceptan?":
    "What payment methods do you accept?",
  "Actualmente mostramos opciones como Visa, MasterCard y Amex. La disponibilidad final depende del proceso de pago activo en el sitio al momento de completar tu compra.":
    "We currently show options such as Visa, MasterCard, and Amex. Final availability depends on the active payment flow on the site when you complete your purchase.",
  "¿Es seguro comprar en el sitio?":
    "Is it safe to buy on the site?",
  "Sí. Procuramos mantener un proceso de compra claro y seguro para proteger la información necesaria durante el pago y la gestión del pedido.":
    "Yes. We strive to keep the purchase flow clear and secure to protect the information required during payment and order management.",
  "¿Puedo solicitar ayuda si mi pago no se refleja?":
    "Can I ask for help if my payment does not appear?",
  "Sí. Si tienes algún problema con el pago o no ves la confirmación de tu compra, contáctanos con tu nombre y correo para revisarlo contigo.":
    "Yes. If you have any payment issue or do not see your purchase confirmation, contact us with your name and email so we can review it with you.",
  "Atencion al cliente": "Customer support",
  "Escribenos para cualquier duda sobre pedidos, envios, cambios o recomendaciones de producto.":
    "Write to us with any questions about orders, shipping, exchanges, or product recommendations.",
  "Telefono": "Phone",
  "Horario": "Hours",
  "24 horas al dia, 7 dias a la semana": "24 hours a day, 7 days a week",
  "Escribenos": "Write to us",
  "Nombre *": "Name *",
  "Correo electronico *": "Email *",
  "Tu mensaje": "Your message",
  "Enviando mensaje...": "Sending message...",
  "Gracias. Tu mensaje fue enviado correctamente.":
    "Thank you. Your message was sent successfully.",
  "No se pudo enviar el formulario.": "The form could not be sent.",
  "Contacta a ELITE 7 PIEL por WhatsApp":
    "Contact ELITE 7 PIEL on WhatsApp",
  "Catalogo completo": "Complete catalog",
  "Todos nuestros productos": "All our products",
  "Tienda de cuidado facial y capilar":
    "Facial and hair care store",
  "Encuentra productos para cuidado de la piel, tecnologia facial en casa y tratamientos para cabello dañado con enfoque profesional.":
    "Find skin care products, at-home facial technology, and treatments for damaged hair with a professional approach.",
  "Explorar tienda": "Explore store",
  "Producto": "Product",
  "Compartir:": "Share:",
  "Quitar de favoritos": "Remove from wishlist",
  "Agregar a favoritos": "Add to wishlist",
  "Vista rápida": "Quick view",
  "Ver opciones": "View options",
  "Agotado": "Out of stock",
  "Ya en carrito": "Already in cart",
  "Agregar al carrito": "Add to cart",
  "Valoración del producto": "Product rating",
  "Más reciente": "Newest",
  "Más antiguo": "Oldest",
  "Precio: menor a mayor": "Price: low to high",
  "Precio: mayor a menor": "Price: high to low",
  "Más populares": "Most popular",
  "Filtros": "Filters",
  "Ordenar productos": "Sort products",
  "Cambiar vista": "Change view",
  "Categorías": "Categories",
  "Todos los productos": "All products",
  "Productos destacados": "Featured products",
  "Atencion y ubicacion": "Support and location",
  "Nuestro canal principal de atencion esta disponible por WhatsApp y correo para dudas sobre productos, pedidos, envios y recomendaciones de compra.":
    "Our main support channel is available through WhatsApp and email for questions about products, orders, shipping, and purchase recommendations.",
  "Atencion en Ciudad de Mexico": "Support in Mexico City",
  "Buscar ubicacion": "Search location",
  "Atencion en ": "Support in ",
  "Ver en el mapa": "View on the map",
  "Atencion digital y coordinacion comercial desde Ciudad de Mexico":
    "Digital support and commercial coordination from Mexico City",
  "Ciudad de Mexico": "Mexico City",
  "Blog de belleza": "Beauty blog",
  "Articulos de belleza y cuidado personal":
    "Beauty and personal care articles",
  "Por ": "By ",
  "Seguir leyendo": "Continue reading",
  "Ver mas": "View more",
  "Portada del blog de Elite 7 Piel":
    "Elite 7 Piel blog cover",
  "Rutina diaria para una piel mas luminosa y equilibrada":
    "Daily routine for brighter, more balanced skin",
  "Cuidado facial": "Facial care",
  "Una rutina simple, constante y bien elegida puede ayudarte a mantener la piel limpia, hidratada y con mejor textura todos los dias.":
    "A simple, consistent, and well-chosen routine can help keep your skin clean, hydrated, and smoother every day.",
  "Mantener una rutina facial efectiva no requiere demasiados pasos, sino productos adecuados para las necesidades reales de tu piel. La constancia, la limpieza suave y la hidratacion son la base para una apariencia saludable.":
    "Maintaining an effective facial routine does not require too many steps, only products suited to your skin's real needs. Consistency, gentle cleansing, and hydration are the foundation of a healthy appearance.",
  "Que no debe faltar en tu rutina diaria":
    "What your daily routine should not skip",
  "Antes de incorporar nuevos productos, conviene identificar si tu piel necesita controlar grasa, reforzar hidratacion o mejorar luminosidad. Con eso claro, es mas facil elegir activos y texturas que realmente funcionen.":
    "Before adding new products, it helps to identify whether your skin needs oil control, stronger hydration, or more radiance. Once that is clear, it is easier to choose ingredients and textures that really work.",
  "Claves para ver resultados": "Keys to seeing results",
  "Limpia tu rostro por la manana y por la noche sin irritar la barrera cutanea.":
    "Cleanse your face in the morning and at night without irritating the skin barrier.",
  "Aplica hidratacion ligera o intensa segun tu tipo de piel y el clima.":
    "Apply light or rich hydration depending on your skin type and the weather.",
  "Usa proteccion solar todos los dias para prevenir manchas y envejecimiento prematuro.":
    "Use sun protection every day to prevent dark spots and premature aging.",
  "Orden sugerido de aplicacion": "Suggested application order",
  "Limpieza facial adecuada para uso diario.":
    "Facial cleansing suitable for daily use.",
  "Serum o tratamiento enfocado en hidratacion, firmeza o luminosidad.":
    "Serum or treatment focused on hydration, firmness, or radiance.",
  "Crema facial y protector solar como cierre de la rutina matutina.":
    "Face cream and sunscreen to finish the morning routine.",
  "Una piel bien cuidada responde mejor a cualquier tratamiento complementario. Por eso es importante construir una base consistente antes de buscar soluciones mas avanzadas.":
    "Well-cared-for skin responds better to any complementary treatment. That is why it is important to build a consistent foundation before looking for more advanced solutions.",
  "En ELITE 7 PIEL reunimos productos y herramientas para acompanar rutinas faciales practicas, seguras y pensadas para el uso diario en casa.":
    "At ELITE 7 PIEL, we bring together products and tools to support practical, safe facial routines designed for daily use at home.",
  "Como elegir productos de belleza segun tu tipo de piel":
    "How to choose beauty products for your skin type",
  Belleza: "Beauty",
  "Elegir por tendencia rara vez es suficiente. La mejor compra es la que responde a tu tipo de piel, tus objetivos y la frecuencia real con la que usaras cada producto.":
    "Choosing by trend is rarely enough. The best purchase is the one that fits your skin type, your goals, and how often you will actually use each product.",
  "Cada piel reacciona de forma distinta a texturas, ingredientes y niveles de concentracion. Entender si necesitas equilibrio, hidratacion profunda o apoyo contra imperfecciones te ayuda a comprar mejor.":
    "Every skin type reacts differently to textures, ingredients, and concentration levels. Understanding whether you need balance, deep hydration, or support against imperfections helps you shop better.",
  "Elegir bien tambien evita exceso de productos":
    "Choosing well also prevents product overload",
  "Muchas rutinas fallan por acumulacion: demasiados activos, pasos redundantes o formulas que no se adaptan entre si. Una seleccion mas precisa suele dar mejores resultados que una rutina extensa.":
    "Many routines fail because of accumulation: too many actives, redundant steps, or formulas that do not fit together. A more precise selection usually delivers better results than an overly long routine.",
  "Que revisar antes de comprar": "What to review before buying",
  "Tipo de piel: seca, mixta, grasa o sensible.":
    "Skin type: dry, combination, oily, or sensitive.",
  "Objetivo principal: hidratacion, manchas, firmeza, textura o control de brillo.":
    "Main goal: hydration, dark spots, firmness, texture, or shine control.",
  "Frecuencia de uso y compatibilidad con el resto de tu rutina.":
    "Frequency of use and compatibility with the rest of your routine.",
  "Senales de una compra inteligente": "Signs of a smart purchase",
  "Formulas claras y faciles de integrar en tu rutina actual.":
    "Clear formulas that are easy to integrate into your current routine.",
  "Texturas comodas para tu clima y horario de uso.":
    "Comfortable textures for your climate and routine.",
  "Beneficios concretos en lugar de promesas demasiado amplias.":
    "Concrete benefits instead of overly broad promises.",
  "Comprar menos, pero mejor, suele ser la estrategia mas efectiva para sostener una rutina a largo plazo.":
    "Buying less, but better, is usually the most effective strategy for maintaining a routine over the long term.",
  "Nuestro catalogo esta pensado para que encuentres opciones de cuidado facial, capilar y belleza con un enfoque practico y funcional.":
    "Our catalog is designed so you can find facial care, hair care, and beauty options with a practical, functional approach.",
  "Tecnologia estetica en casa: beneficios y cuidados basicos":
    "At-home beauty technology: benefits and basic care",
  "Tecnologia estetica": "Beauty technology",
  "Los dispositivos de belleza para uso personal pueden complementar tu rutina si se usan con constancia, higiene y expectativas realistas.":
    "Personal beauty devices can complement your routine when used consistently, hygienically, and with realistic expectations.",
  "La tecnologia estetica para casa se ha vuelto una aliada para reforzar masajes faciales, cuidado capilar y rutinas de mantenimiento. Lo importante es integrarla de forma segura y compatible con tus objetivos.":
    "At-home beauty technology has become a useful ally for supporting facial massage, hair care, and maintenance routines. The important part is integrating it safely and in line with your goals.",
  "La tecnologia funciona mejor con una rutina bien hecha":
    "Technology works best with a solid routine",
  "Un dispositivo no sustituye la limpieza, la hidratacion ni la proteccion solar. Su verdadero valor aparece cuando acompana una rutina estable y productos adecuados.":
    "A device does not replace cleansing, hydration, or sunscreen. Its real value appears when it supports a stable routine and suitable products.",
  "Buenas practicas de uso": "Good usage practices",
  "Lee las indicaciones del equipo y respeta la frecuencia recomendada.":
    "Read the device instructions and follow the recommended frequency.",
  "Usa el dispositivo sobre piel limpia y con productos compatibles.":
    "Use the device on clean skin and with compatible products.",
  "Mantelo limpio y guardado correctamente despues de cada sesion.":
    "Keep it clean and store it properly after each session.",
  "Antes de incorporar un dispositivo": "Before adding a device",
  "Define si buscas apoyo facial, corporal o capilar.":
    "Define whether you want facial, body, or hair support.",
  "Verifica intensidad, modo de uso y mantenimiento.":
    "Check intensity, usage mode, and maintenance requirements.",
  "Prioriza equipos faciles de integrar en tu rutina semanal.":
    "Prioritize devices that are easy to integrate into your weekly routine.",
  "La constancia suele ser mas importante que la intensidad. Un uso ordenado y realista ofrece mejores resultados que sesiones esporadicas o excesivas.":
    "Consistency is usually more important than intensity. Organized, realistic use delivers better results than sporadic or excessive sessions.",
  "En ELITE 7 PIEL seleccionamos herramientas pensadas para complementar el cuidado personal en casa con practicidad.":
    "At ELITE 7 PIEL, we select tools designed to complement personal care at home in a practical way.",
  "Cuidado capilar diario para mantener brillo y suavidad":
    "Daily hair care to maintain shine and softness",
  "Cuidado capilar": "Hair care",
  "El cabello tambien necesita una rutina clara: limpieza adecuada, nutricion en medios y puntas y proteccion frente al calor y la deshidratacion.":
    "Hair also needs a clear routine: proper cleansing, nourishment through mid-lengths and ends, and protection from heat and dehydration.",
  "El brillo y la suavidad del cabello dependen tanto de los productos que eliges como de la forma en la que los aplicas. Pequenos ajustes en la rutina diaria pueden mejorar notablemente su apariencia.":
    "Hair shine and softness depend on both the products you choose and how you apply them. Small adjustments in your daily routine can noticeably improve its appearance.",
  "Menos agresion, mejores resultados": "Less damage, better results",
  "Lavar en exceso, usar calor sin proteccion o saturar el cabello con productos pesados puede afectar su textura. Una rutina equilibrada ayuda a mantenerlo manejable y con mejor apariencia.":
    "Overwashing, using heat without protection, or saturating the hair with heavy products can affect its texture. A balanced routine helps keep it manageable and looking better.",
  "Habitos que marcan diferencia": "Habits that make a difference",
  "Elige shampoo y tratamiento segun tu tipo de cuero cabelludo y largo.":
    "Choose shampoo and treatment based on your scalp type and hair length.",
  "Aplica mascarillas o tratamientos de medios a puntas segun necesidad.":
    "Apply masks or treatments from mid-lengths to ends as needed.",
  "Protege el cabello antes del secado, planchado o exposicion prolongada al sol.":
    "Protect the hair before blow-drying, straightening, or long sun exposure.",
  "Rutina base recomendada": "Recommended basic routine",
  "Limpieza suave y enfocada en el cuero cabelludo.":
    "Gentle cleansing focused on the scalp.",
  "Acondicionador o mascarilla para sellar suavidad y facilitar el peinado.":
    "Conditioner or mask to seal in softness and ease styling.",
  "Producto de acabado para brillo, control de frizz o proteccion termica.":
    "Finishing product for shine, frizz control, or heat protection.",
  "La salud capilar se construye con habitos repetibles y formulas adecuadas para tu estilo de vida.":
    "Hair health is built through repeatable habits and formulas that fit your lifestyle.",
  "Nuestro catalogo integra opciones para cuidado diario, mantenimiento y apoyo estetico del cabello desde casa.":
    "Our catalog includes options for daily care, maintenance, and aesthetic hair support from home.",
  "Detalle visual de rutina de belleza":
    "Visual detail of a beauty routine",
  "Productos de cuidado personal Elite 7 Piel":
    "Elite 7 Piel personal care products",
  "Compartir en Facebook": "Share on Facebook",
  "Compartir en X": "Share on X",
  "Guardar en Pinterest": "Save on Pinterest",
  "VOLVER AL BLOG": "BACK TO THE BLOG",
  "Explora mas articulos sobre piel, cabello y belleza.":
    "Explore more articles about skin, hair, and beauty.",
  "IR A LA TIENDA": "GO TO THE STORE",
  "Descubre productos para complementar tu rutina.":
    "Discover products to complement your routine.",
  Comentarios: "Comments",
  "Me gusto que el articulo explica la rutina de forma clara y practica. Ayuda mucho cuando estas empezando a cuidar mejor tu piel.":
    "I liked that the article explains the routine clearly and practically. It really helps when you are just starting to take better care of your skin.",
  "Buen resumen para elegir productos sin complicarse. Se siente mas util que el contenido generico de muchos blogs de belleza.":
    "Good summary for choosing products without overcomplicating things. It feels more useful than the generic content found on many beauty blogs.",
  "Avatar de Mariana Torres": "Avatar of Mariana Torres",
  "Avatar de Daniela Cruz": "Avatar of Daniela Cruz",
  "09 abril 2026": "April 09, 2026",
  "Comparte tu opinion sobre este articulo":
    "Share your opinion about this article",
  "Tu correo no se publicara. Los campos obligatorios estan marcados con *":
    "Your email will not be published. Required fields are marked with *",
  "Tu valoracion *": "Your rating *",
  "Escribe tu comentario": "Write your comment",
  "Guardar mi nombre y correo en este navegador para la proxima vez que comente.":
    "Save my name and email in this browser for the next time I comment.",
  "Enviar comentario": "Send comment",
  "Información del producto disponible pronto.":
    "Product information coming soon.",
  "Sin categoría": "Uncategorized",
  "(1 opinión)": "(1 review)",
  "Información del producto:": "Product information:",
  Cantidad: "Quantity",
  Talla: "Size",
  "Comprar ahora": "Buy now",
  Categoría: "Category",
  Etiquetas: "Tags",
  "Uso del sitio": "Use of the site",
  "Al navegar por ELITE 7 PIEL aceptas utilizar el sitio de forma licita, sin afectar su funcionamiento, su seguridad ni la experiencia de otros usuarios. La informacion publicada tiene fines comerciales e informativos y puede actualizarse sin previo aviso.":
    "By browsing ELITE 7 PIEL, you agree to use the site lawfully and without affecting its operation, security, or the experience of other users. The published information has commercial and informational purposes and may be updated without prior notice.",
  "Informacion de productos": "Product information",
  "Nos esforzamos por mostrar descripciones, imagenes, beneficios y precios con la mayor precision posible. Aun asi, algunos detalles visuales pueden variar ligeramente segun disponibilidad, presentacion del fabricante o actualizaciones del catalogo.":
    "We strive to show descriptions, images, benefits, and prices as accurately as possible. Even so, some visual details may vary slightly depending on availability, manufacturer presentation, or catalog updates.",
  "Pedidos y confirmacion": "Orders and confirmation",
  "La recepcion de un pedido no implica su aceptacion definitiva. ELITE 7 PIEL puede validar existencias, datos de contacto y condiciones de pago antes de confirmar el envio. Si surge alguna incidencia, nuestro equipo se pondra en contacto contigo por correo o WhatsApp.":
    "Receiving an order does not imply final acceptance. ELITE 7 PIEL may validate stock, contact information, and payment conditions before confirming shipment. If any issue arises, our team will contact you by email or WhatsApp.",
  "Pagos y promociones": "Payments and promotions",
  "Los precios, descuentos y promociones pueden cambiar sin previo aviso. Las ofertas aplican exclusivamente durante su vigencia y bajo las condiciones indicadas en cada campana. Los cargos finales se muestran antes de concluir la compra.":
    "Prices, discounts, and promotions may change without prior notice. Offers apply only during their validity period and under the conditions stated in each campaign. Final charges are shown before completing the purchase.",
  "Envios y tiempos de entrega": "Shipping and delivery times",
  "Los tiempos de entrega pueden variar segun la ubicacion, la paqueteria y la disponibilidad de producto. Una vez confirmado el pedido, te compartiremos el seguimiento cuando aplique. Los retrasos atribuibles a terceros pueden modificar la fecha estimada de entrega.":
    "Delivery times may vary depending on location, carrier, and product availability. Once the order is confirmed, we will share tracking information when available. Delays attributable to third parties may change the estimated delivery date.",
  "Atencion y responsabilidad": "Support and responsibility",
  "Si necesitas apoyo con un producto, pedido o recomendacion de uso, puedes contactarnos por nuestros canales oficiales. ELITE 7 PIEL no sera responsable por danos indirectos derivados del uso inadecuado del sitio o de la interpretacion individual de la informacion publicada.":
    "If you need help with a product, order, or usage recommendation, you can contact us through our official channels. ELITE 7 PIEL will not be responsible for indirect damages derived from improper use of the site or from the individual interpretation of the published information.",
  "Estos terminos regulan el acceso, la navegacion y la compra de productos en ELITE 7 PIEL. Te recomendamos leerlos antes de realizar un pedido o utilizar cualquiera de nuestros canales digitales.":
    "These terms regulate access, navigation, and the purchase of products on ELITE 7 PIEL. We recommend reading them before placing an order or using any of our digital channels.",
  "Aviso de Privacidad": "Privacy Notice",
  "En ELITE 7 PIEL reconocemos la importancia de proteger tus datos personales. Este aviso describe qué información podemos recabar, con qué finalidades la utilizamos, cómo puedes ejercer tus derechos ARCO y qué medidas aplicamos para resguardar tu información.":
    "At ELITE 7 PIEL, we recognize the importance of protecting your personal data. This notice describes what information we may collect, for what purposes we use it, how you can exercise your ARCO rights, and what measures we apply to protect your information.",
  Marca: "Brand",
  Responsable: "Data Controller",
  Correo: "Email",
  Dominio: "Domain",
  "Domicilio para efectos de atención de solicitudes relacionadas con datos personales:\n[PENDIENTE: insertar domicilio comercial, fiscal o de correspondencia del responsable]":
    "Address for handling requests related to personal data:\n[PENDING: insert the controller's business, tax, or correspondence address]",
  "1. Datos personales que podemos recabar":
    "1. Personal data we may collect",
  "Podemos recabar datos personales cuando navegas en el sitio, cuando realizas una compra, cuando te registras, cuando solicitas atención al cliente o cuando te suscribes a comunicaciones comerciales.":
    "We may collect personal data when you browse the site, make a purchase, register, request customer support, or subscribe to commercial communications.",
  "Datos de identificación, como nombre completo.":
    "Identification data, such as full name.",
  "Datos de contacto, como correo electrónico y teléfono.":
    "Contact data, such as email and phone number.",
  "Datos de compra, facturación, pedidos y preferencias.":
    "Purchase, billing, order, and preference data.",
  "Datos técnicos de navegación, como dirección IP, navegador, dispositivo, páginas visitadas y cookies.":
    "Technical browsing data, such as IP address, browser, device, visited pages, and cookies.",
  "2. Finalidades del tratamiento": "2. Processing purposes",
  "Finalidades primarias": "Primary purposes",
  "Procesar compras, pagos, envíos, devoluciones y aclaraciones.":
    "Process purchases, payments, shipments, returns, and inquiries.",
  "Dar seguimiento a pedidos y brindar atención al cliente.":
    "Track orders and provide customer support.",
  "Verificar identidad, prevenir fraudes y proteger la seguridad del sitio.":
    "Verify identity, prevent fraud, and protect site security.",
  "Cumplir obligaciones legales, fiscales, contractuales y de servicio.":
    "Comply with legal, tax, contractual, and service obligations.",
  "Finalidades secundarias": "Secondary purposes",
  "Enviar promociones, novedades, recordatorios de carrito o comunicaciones comerciales.":
    "Send promotions, updates, cart reminders, or commercial communications.",
  "Mejorar nuestros productos, experiencia de usuario, campañas y contenidos.":
    "Improve our products, user experience, campaigns, and content.",
  "Realizar análisis estadísticos y medición de desempeño.":
    "Carry out statistical analysis and performance measurement.",
  "Si no deseas que tus datos sean tratados para finalidades secundarias, puedes solicitarlo en cualquier momento al correo ":
    "If you do not want your data to be processed for secondary purposes, you may request it at any time at ",
  "3. Derechos ARCO y revocación del consentimiento":
    "3. ARCO rights and withdrawal of consent",
  "Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales, así como a revocar el consentimiento que nos hayas otorgado para determinadas finalidades.":
    "You have the right to access, rectify, cancel, or object to the processing of your personal data, as well as to withdraw the consent you have granted us for certain purposes.",
  "Para ejercer tus derechos ARCO o solicitar la revocación del consentimiento, envía una solicitud al correo ":
    "To exercise your ARCO rights or request withdrawal of consent, send a request to ",
  "indicando:": "indicating:",
  "Nombre del titular.": "Name of the data subject.",
  "Medio de contacto para responder la solicitud.":
    "Contact method for responding to the request.",
  "Descripción clara del derecho que deseas ejercer.":
    "Clear description of the right you want to exercise.",
  "En su caso, documentos o datos que ayuden a identificar tu información.":
    "Where applicable, documents or data that help identify your information.",
  "4. Transferencias de datos": "4. Data transfers",
  "Tus datos personales podrán ser compartidos únicamente cuando sea necesario para procesar pagos, logística, mensajería, hospedaje del sitio, herramientas tecnológicas o cumplimiento de obligaciones legales. En todos los casos procuramos que dichos terceros actúen bajo medidas razonables de confidencialidad y seguridad.":
    "Your personal data may only be shared when necessary to process payments, logistics, shipping, site hosting, technology tools, or compliance with legal obligations. In all cases, we seek to ensure that such third parties operate under reasonable confidentiality and security measures.",
  "5. Cookies y tecnologías similares":
    "5. Cookies and similar technologies",
  "Nuestro sitio puede utilizar cookies, etiquetas de seguimiento, píxeles u otras tecnologías similares para recordar preferencias, mejorar la experiencia de navegación, analizar el comportamiento del sitio y medir campañas. Para mayor detalle consulta nuestra ":
    "Our site may use cookies, tracking tags, pixels, or other similar technologies to remember preferences, improve browsing experience, analyze site behavior, and measure campaigns. For more detail, review our ",
  "Política de Cookies": "Cookie Policy",
  "6. Seguridad y conservación": "6. Security and retention",
  "Aplicamos medidas administrativas, técnicas y organizativas razonables para proteger los datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado. Conservaremos la información únicamente durante el tiempo necesario para cumplir con las finalidades descritas y con las obligaciones aplicables.":
    "We apply reasonable administrative, technical, and organizational measures to protect personal data against damage, loss, alteration, destruction, or unauthorized use. We will retain information only for the time necessary to fulfill the described purposes and applicable obligations.",
  "7. Cambios al aviso": "7. Changes to this notice",
  "Este aviso puede actualizarse en cualquier momento por cambios legales, operativos o de negocio. Las modificaciones estarán disponibles en esta misma ruta: ":
    "This notice may be updated at any time due to legal, operational, or business changes. Updates will be available at this same path: ",
  "8. Contacto": "8. Contact",
  "Si tienes dudas sobre este Aviso de Privacidad o sobre el tratamiento de tus datos personales, puedes escribir a ":
    "If you have questions about this Privacy Notice or the processing of your personal data, you can write to ",
  "Política de Cookies": "Cookie Policy",
  "Esta Política de Cookies explica qué tecnologías de seguimiento puede utilizar ELITE 7 PIEL en elite7piel.com, con qué finalidades se emplean y cómo puedes administrarlas desde tu navegador o dispositivo.":
    "This Cookie Policy explains what tracking technologies ELITE 7 PIEL may use on elite7piel.com, why they are used, and how you can manage them from your browser or device.",
  "1. ¿Qué son las cookies?": "1. What are cookies?",
  "Las cookies son archivos de texto que un sitio web almacena en tu navegador o dispositivo para recordar información sobre tu visita. También pueden utilizarse tecnologías similares, como píxeles, identificadores o almacenamiento local.":
    "Cookies are text files that a website stores in your browser or device to remember information about your visit. Similar technologies may also be used, such as pixels, identifiers, or local storage.",
  "2. ¿Qué tipos de cookies pueden utilizarse?":
    "2. What types of cookies may be used?",
  "Cookies necesarias:": "Necessary cookies:",
  "permiten funciones básicas del sitio, como navegación, seguridad, carrito o sesión.":
    "enable basic site functions such as navigation, security, cart, or session support.",
  "Cookies de preferencias:": "Preference cookies:",
  "recuerdan idioma, moneda, configuraciones u opciones de navegación.":
    "remember language, currency, settings, or navigation preferences.",
  "Cookies analíticas:": "Analytics cookies:",
  "ayudan a entender cómo se usa el sitio para mejorar rendimiento y experiencia.":
    "help understand how the site is used so performance and experience can be improved.",
  "Cookies publicitarias o de medición:": "Advertising or measurement cookies:",
  "pueden utilizarse para personalizar campañas y medir resultados.":
    "may be used to personalize campaigns and measure results.",
  "3. Finalidades de uso": "3. Purposes of use",
  "Estas tecnologías pueden utilizarse para:":
    "These technologies may be used to:",
  "Permitir el funcionamiento correcto del sitio.":
    "Allow the site to function properly.",
  "Recordar tus preferencias y configuraciones.":
    "Remember your preferences and settings.",
  "Medir tráfico, rendimiento y comportamiento de navegación.":
    "Measure traffic, performance, and browsing behavior.",
  "Prevenir fraudes y reforzar la seguridad.":
    "Prevent fraud and strengthen security.",
  "Mejorar contenidos, campañas y experiencia de compra.":
    "Improve content, campaigns, and the shopping experience.",
  "4. Cookies de terceros": "4. Third-party cookies",
  "Algunas cookies o tecnologías similares pueden ser gestionadas por terceros que prestan servicios tecnológicos, analíticos, de pago, publicidad o atención. El tratamiento realizado por esos terceros se rige además por sus propias políticas.":
    "Some cookies or similar technologies may be managed by third parties that provide technology, analytics, payment, advertising, or support services. Processing carried out by those third parties is also governed by their own policies.",
  "5. Cómo desactivar o administrar cookies":
    "5. How to disable or manage cookies",
  "Puedes limitar, bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que algunas funciones del sitio podrían dejar de operar correctamente si desactivas ciertas cookies necesarias.":
    "You can limit, block, or delete cookies from your browser settings. Please note that some site features may stop working correctly if you disable certain necessary cookies.",
  "6. Relación con el Aviso de Privacidad":
    "6. Relationship with the Privacy Notice",
  "Esta política complementa el ": "This policy complements the ",
  " de ELITE 7 PIEL, donde se describe el tratamiento general de datos personales, los derechos ARCO y los medios de contacto.":
    " of ELITE 7 PIEL, where the general processing of personal data, ARCO rights, and contact channels are described.",
  "7. Contacto y cambios": "7. Contact and changes",
  "Si tienes dudas sobre esta política puedes escribir a ":
    "If you have questions about this policy, you can write to ",
  ". Esta política puede actualizarse en cualquier momento y la versión vigente estará disponible en esta misma ruta.":
    ". This policy may be updated at any time and the current version will be available at this same path.",
};

const manualPartial = {
  "Mostrando ": "Showing ",
  " articulos": " articles",
  " artículo": " article",
  " artículos": " articles",
  " producto": " product",
  " productos": " products",
  " opiniones)": " reviews)",
  " opinión)": " review)",
  "Enviando...": "Sending...",
  "Gracias. Tu suscripcion fue enviada.": "Thank you. Your subscription was sent.",
};

export const englishTranslations = {
  exact: {
    ...invertEntries(spanishTranslations.exact || {}),
    ...buildSeoKeywordEntries(),
    ...manualExact,
  },
  partial: {
    ...invertEntries(spanishTranslations.partial || {}),
    ...manualPartial,
  },
  ignore: Array.from(
    new Set([...(spanishTranslations.ignore || []), "ELITE 7 PIEL", "MXN"])
  ),
};
