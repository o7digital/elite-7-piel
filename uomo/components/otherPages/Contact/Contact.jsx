"use client";

import { useState } from "react";
import { submitFormspree } from "@/lib/formspree";

export default function Contact() {
  const [formStatus, setFormStatus] = useState({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("form_type", "contact");
    formData.set("_subject", "Contacto ELITE 7 PIEL");

    setFormStatus({
      type: "loading",
      message: "Enviando mensaje...",
    });

    try {
      await submitFormspree(formData);
      form.reset();
      setFormStatus({
        type: "success",
        message: "Gracias. Tu mensaje fue enviado correctamente.",
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error.message || "No se pudo enviar el formulario.",
      });
    }
  };

  return (
    <section className="contact-us container">
      <div className="mw-930">
        <div className="contact-us__content row mb-5 gy-4">
          <div className="col-lg-5">
            <h3 className="mb-4">Atencion al cliente</h3>
            <p className="mb-4">
              Escribenos para cualquier duda sobre pedidos, envios, cambios o
              recomendaciones de producto.
            </p>
            <p className="mb-4">
              <strong>Email</strong>
              <br />
              <a href="mailto:ventas@elite7piel.com">
                ventas@elite7piel.com
              </a>
            </p>
            <p className="mb-4">
              <strong>Telefono</strong>
              <br />
              +52 5510522299
            </p>
            <p className="mb-0">
              <strong>Horario</strong>
              <br />
              24 horas al dia, 7 dias a la semana
            </p>
          </div>
          <div className="col-lg-7">
            <div className="contact-us__form">
              <form className="needs-validation" onSubmit={handleSubmit}>
                <h3 className="mb-5">Escribenos</h3>
                <div className="form-floating my-4">
                  <input
                    type="text"
                    className="form-control"
                    id="contact_us_name"
                    name="name"
                    placeholder="Nombre *"
                    required
                  />
                  <label htmlFor="contact_us_name">Nombre *</label>
                </div>
                <div className="form-floating my-4">
                  <input
                    type="email"
                    className="form-control"
                    id="contact_us_email"
                    name="email"
                    placeholder="Correo electronico *"
                    required
                  />
                  <label htmlFor="contact_us_email">Correo electronico *</label>
                </div>
                <div className="my-4">
                  <textarea
                    className="form-control form-control_gray"
                    placeholder="Tu mensaje"
                    name="message"
                    cols="30"
                    rows="8"
                    required
                  ></textarea>
                </div>
                <div className="my-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formStatus.type === "loading"}
                  >
                    {formStatus.type === "loading" ? "Enviando..." : "Enviar"}
                  </button>
                </div>
                {formStatus.message ? (
                  <p
                    className={`mb-0 ${
                      formStatus.type === "error" ? "text-danger" : "text-success"
                    }`}
                  >
                    {formStatus.message}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
