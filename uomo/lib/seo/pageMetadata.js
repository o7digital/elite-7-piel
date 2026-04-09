const siteName = "ELITE 7 PIEL";

function buildMetadata({
  title,
  description,
  index = true,
  follow = true,
} = {}) {
  return {
    title,
    description,
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": index ? -1 : 0,
      },
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: "es_MX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const demoHomeMetadata = buildMetadata({
  title: "Colecciones y catalogo de belleza",
  description:
    "Vista complementaria del catalogo y las colecciones de cuidado facial, capilar y belleza profesional de ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const shopVariantMetadata = buildMetadata({
  title: "Variantes de catalogo y colecciones",
  description:
    "Explora variaciones de listado de productos y colecciones de belleza, cuidado facial y tratamiento capilar de ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const productVariantMetadata = buildMetadata({
  title: "Detalle de producto y variantes de compra",
  description:
    "Consulta variantes de fichas de producto, rutinas de belleza y opciones de compra dentro del catalogo de ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const blogListingMetadata = buildMetadata({
  title: "Blog de belleza, piel y cabello",
  description:
    "Lee articulos y consejos sobre cuidado facial, tratamiento capilar, rutinas de belleza y tecnologia estetica en ELITE 7 PIEL.",
});

export const accountNoIndexMetadata = buildMetadata({
  title: "Acceso y gestion de cuenta",
  description:
    "Area privada para gestionar pedidos, direcciones, favoritos y datos de tu cuenta en ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const loginMetadata = buildMetadata({
  title: "Acceso a tu cuenta",
  description:
    "Inicia sesion o crea tu cuenta para gestionar pedidos, favoritos y datos personales en ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const resetPasswordMetadata = buildMetadata({
  title: "Recuperar contrasena",
  description:
    "Restablece el acceso a tu cuenta de ELITE 7 PIEL de forma segura.",
  index: false,
  follow: false,
});

export const lookbookMetadata = buildMetadata({
  title: "Lookbook de belleza y cuidado personal",
  description:
    "Descubre una seleccion visual de productos, estilos y rutinas de cuidado facial, capilar y belleza en ELITE 7 PIEL.",
});

export const termsMetadata = buildMetadata({
  title: "Terminos y condiciones",
  description:
    "Consulta los terminos y condiciones de uso, compra, pagos y servicio aplicables en ELITE 7 PIEL.",
});

export const storeLocationMetadata = buildMetadata({
  title: "Ubicacion y atencion",
  description:
    "Consulta informacion de ubicacion, contacto y atencion relacionada con ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const comingSoonMetadata = buildMetadata({
  title: "Proximamente",
  description:
    "Pagina temporal de proximos lanzamientos y novedades de ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const notFoundMetadata = buildMetadata({
  title: "Pagina no encontrada",
  description:
    "La pagina que buscas no esta disponible. Explora el catalogo y las secciones principales de ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const cartMetadata = buildMetadata({
  title: "Carrito de compra",
  description:
    "Revision temporal de productos agregados al carrito antes de finalizar la compra en ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const checkoutMetadata = buildMetadata({
  title: "Checkout y envio",
  description:
    "Proceso temporal de envio y pago para completar tu compra en ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const orderCompleteMetadata = buildMetadata({
  title: "Orden recibida",
  description:
    "Confirmacion temporal posterior a la compra en ELITE 7 PIEL.",
  index: false,
  follow: false,
});

export const orderTrackingMetadata = buildMetadata({
  title: "Seguimiento de pedido",
  description:
    "Consulta temporal del estado de un pedido realizado en ELITE 7 PIEL.",
  index: false,
  follow: false,
});
