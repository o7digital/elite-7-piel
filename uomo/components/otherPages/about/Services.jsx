import React from "react";

const aboutHighlights = [
  {
    icon: "#icon_shipping",
    title: "PRODUCTOS SELECCIONADOS",
    content:
      "Elegimos cremas, tratamientos y tecnologia estetica con enfoque en calidad, seguridad y uso practico.",
  },
  {
    icon: "#icon_headphone",
    title: "ATENCION CERCANA",
    content:
      "Acompanamos a cada cliente para ayudarle a encontrar opciones alineadas con su rutina y sus objetivos.",
  },
  {
    icon: "#icon_shield",
    title: "BIENESTAR Y CONFIANZA",
    content:
      "Buscamos ofrecer soluciones que ayuden a verse mejor, sentirse bien y fortalecer la confianza personal.",
  },
];

export default function Services() {
  return (
    <section className="service-promotion horizontal container mw-930 pt-0 mb-md-4 pb-md-4 mb-xl-5">
      <div className="row">
        {aboutHighlights.map((elm, i) => (
          <div key={i} className="col-md-4 text-center mb-5 mb-md-0">
            <div className="service-promotion__icon mb-4">
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href={elm.icon} />
              </svg>
            </div>
            <h3 className="service-promotion__title fs-6 text-uppercase">
              {elm.title}
            </h3>
            <p className="service-promotion__content text-secondary">
              {elm.content}
            </p>
          </div>
        ))}

        {/* <!-- /.col-md-4 text-center--> */}
      </div>
      {/* <!-- /.row --> */}
    </section>
  );
}
