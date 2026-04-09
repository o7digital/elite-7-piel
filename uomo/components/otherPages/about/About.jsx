import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <section className="about-us container">
      <div className="mw-930">
        <h2 className="page-title">QUIENES SOMOS</h2>
      </div>
      <div className="about-us__content pb-5 mb-5">
        <div
          className="mb-5 position-relative overflow-hidden"
          style={{ aspectRatio: "1410 / 550" }}
        >
          <Image
            fill
            loading="lazy"
            className="d-block"
            style={{ objectFit: "cover" }}
            src="/assets/images/about/meeting-room.webp"
            sizes="(max-width: 1410px) 100vw, 1410px"
            alt="Sala de reunion profesional"
          />
        </div>
        <div className="mw-930">
          <h3 className="mb-4">Nuestra historia</h3>
          <p className="fs-6 fw-medium mb-4">
            En Elite 7 Piel nos apasiona ayudar a las personas a cuidar su
            piel, su cabello y su bienestar con productos de belleza de alta
            calidad y tecnologia estetica pensada para la rutina diaria.
          </p>
          <p className="mb-4">
            Somos una empresa dedicada a ofrecer cremas especializadas,
            dispositivos electronicos para el rejuvenecimiento facial y
            tratamientos para el cuidado capilar. Nuestro objetivo es brindar
            soluciones innovadoras que ayuden a mejorar la apariencia y salud
            de la piel y el cabello, combinando tecnologia moderna con una
            seleccion cuidadosa de productos.
          </p>
          <p className="mb-4">
            Creemos que el cuidado personal es una parte fundamental de la
            confianza y la autoestima. Por eso trabajamos constantemente para
            ofrecer opciones efectivas, seguras y accesibles, pensadas para
            quienes desean verse y sentirse mejor cada dia.
          </p>
          <div className="row mb-3">
            <div className="col-md-6">
              <h5 className="mb-3">Nuestra mision</h5>
              <p className="mb-3">
                Acercar soluciones modernas de cuidado personal que aporten
                beneficios reales y se integren facilmente a la vida diaria de
                nuestros clientes.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Nuestra vision</h5>
              <p className="mb-3">
                Ser una marca de confianza en belleza y bienestar, reconocida
                por ofrecer productos que ayudan a lograr una piel saludable,
                un cabello fuerte y una imagen radiante.
              </p>
            </div>
          </div>
        </div>
        <div className="mw-930 d-lg-flex align-items-lg-center">
          <div className="image-wrapper col-lg-6">
            <Image
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="/assets/images/quienes/compromiso.png"
              width="340"
              height="370"
              alt="Compromiso Elite 7 Piel"
            />
          </div>
          <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">Nuestro compromiso</h5>
            <p>
              En Elite 7 Piel queremos acompanarte en el camino hacia una piel
              mas saludable, un cabello mas fuerte y una belleza que refleje
              bienestar y confianza. Mas que una tienda, buscamos ser tu aliado
              con opciones practicas, confiables y cuidadosamente seleccionadas
              para que puedas cuidar de ti desde la comodidad de tu hogar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
