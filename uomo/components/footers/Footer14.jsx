"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  currencyOptions,
  footerLinks1,
  footerLinks3,
  socialLinks,
} from "@/data/footer";
import { submitFormspree } from "@/lib/formspree";
import LanguageSwitcherSelect from "@/components/common/LanguageSwitcherSelect";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n/locale";
import FooterSeoKeywords from "@/components/common/FooterSeoKeywords";

const FOOTER_LINK_LABELS = {
  Tienda: { en: "Shop", es: "Tienda" },
  "Quiénes Somos": { en: "About Us", es: "Quiénes Somos" },
  Contacto: { en: "Contact", es: "Contacto" },
  "Trabaja con Nosotros": { en: "Work with us", es: "Trabaja con Nosotros" },
  "Preguntas Frecuentes": {
    en: "Frequently Asked Questions",
    es: "Preguntas Frecuentes",
  },
  "Mi cuenta": { en: "My account", es: "Mi cuenta" },
  "Politica de Envios": { en: "Shipping Policy", es: "Politica de Envios" },
  "Impuestos y Aranceles": { en: "Taxes and Duties", es: "Impuestos y Aranceles" },
  "Aviso de Privacidad": { en: "Privacy Notice", es: "Aviso de Privacidad" },
};

export default function Footer14() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const showNewsletterPromo = !["es", "en"].includes(locale);
  const [newsletterStatus, setNewsletterStatus] = useState({
    type: "idle",
    message: "",
  });

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("form_type", "newsletter");
    formData.set("_subject", "Newsletter ELITE 7 PIEL");

    setNewsletterStatus({
      type: "loading",
      message: locale === "en" ? "Sending..." : "Enviando...",
    });

    try {
      await submitFormspree(formData);
      form.reset();
      setNewsletterStatus({
        type: "success",
        message:
          locale === "en"
            ? "Thank you. Your subscription was sent."
            : "Gracias. Tu suscripcion fue enviada.",
      });
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message:
          error.message ||
          (locale === "en"
            ? "The form could not be sent."
            : "No se pudo enviar el formulario."),
      });
    }
  };

  return (
    <footer className="footer footer_type_1 dark">
      <div className="footer-middle container">
        <div className="row row-cols-lg-4 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            <div className="logo">
              <Link href="/" className="site-wordmark site-wordmark_footer text-white">
                ELITE 7 PIEL
              </Link>
            </div>
            {/* <!-- /.logo --> */}
            <p className="m-0">
              <strong className="fw-medium">
                <a
                  href="mailto:ventas@elite7piel.com"
                  className="text-white text-decoration-none"
                >
                  ventas@elite7piel.com
                </a>
              </strong>
            </p>
            <p>
              <strong className="fw-medium">+52 5510522299</strong>
            </p>

            <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer__social-link d-block">
                    <svg
                      className={link.className}
                      width={link.width}
                      height={link.height}
                      viewBox={link.viewBox}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {typeof link.icon === "string" ? (
                        <use href={link.icon} />
                      ) : (
                        link.icon
                      )}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">
              {locale === "en" ? "Company" : "Empresa"}
            </h6>
            <ul className="sub-menu__list list-unstyled">
              {footerLinks1.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link href={elm.href} className="menu-link menu-link_us-s">
                    {FOOTER_LINK_LABELS[elm.text]?.[locale] || elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">
              {locale === "en" ? "Help" : "Ayuda"}
            </h6>
            <ul className="sub-menu__list list-unstyled">
              {footerLinks3.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link href={elm.href} className="menu-link menu-link_us-s">
                    {FOOTER_LINK_LABELS[elm.text]?.[locale] || elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-newsletter col-12 mb-4 mb-lg-0">
            {showNewsletterPromo ? (
              <>
                <h6 className="sub-menu__title text-uppercase">
                  {locale === "en" ? "Subscribe" : "Suscribete"}
                </h6>
                <p>
                  {locale === "en"
                    ? "Be the first to get the latest news about trends, promotions, and much more!"
                    : "Se la primera en conocer noticias sobre tendencias, promociones y mucho mas."}
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="footer-newsletter__form position-relative bg-body"
                >
                  <input
                    className="form-control border-white"
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                  />
                  <button
                    className="btn-link fw-medium bg-white position-absolute top-0 end-0 h-100"
                    type="submit"
                    disabled={newsletterStatus.type === "loading"}
                  >
                    {newsletterStatus.type === "loading"
                      ? locale === "en"
                        ? "Sending..."
                        : "Enviando..."
                      : locale === "en"
                      ? "Submit"
                      : "Enviar"}
                  </button>
                </form>
                {newsletterStatus.message ? (
                  <p
                    className={`mt-2 mb-0 small ${
                      newsletterStatus.type === "error" ? "text-danger" : "text-white"
                    }`}
                  >
                    {newsletterStatus.message}
                  </p>
                ) : null}
              </>
            ) : null}

            <div className="mt-4 pt-2">
              <strong className="fw-medium text-white">
                {locale === "en" ? "Secure payments" : "Pagos seguros"}
              </strong>
              <div className="payment-badges mt-3" data-no-runtime-translate>
                <img
                  src="/assets/images/pago/visa.webp"
                  alt="Visa"
                  width={343}
                  height={147}
                  loading="eager"
                  decoding="sync"
                  className="payment-badge-image"
                />
                <img
                  src="/assets/images/pago/mc.png"
                  alt="MasterCard"
                  width={286}
                  height={176}
                  loading="eager"
                  decoding="sync"
                  className="payment-badge-image"
                />
                <img
                  src="/assets/images/pago/amex.png"
                  alt="Amex"
                  width={268}
                  height={188}
                  loading="eager"
                  decoding="sync"
                  className="payment-badge-image"
                />
              </div>
            </div>
          </div>
          {/* <!-- /.footer-column --> */}
        </div>
        {/* <!-- /.row-cols-4 --> */}
      </div>
      {/* <!-- /.footer-middle container --> */}

      <div className="footer-bottom container">
        <div className="d-block d-md-flex align-items-center">
          <div className="me-auto d-flex flex-wrap align-items-center gap-3">
            <span className="footer-copyright mb-0">
              ©{new Date().getFullYear()} ELITE 7 PIEL
            </span>
            <a
              href="https://o7digital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-none"
            >
              created by o7digital.com
            </a>
          </div>
          <div className="footer-settings d-block d-md-flex align-items-center">
            <a
              href="#top"
              className="btn btn-link p-0 text-white text-decoration-none me-md-4 d-inline-flex align-items-center mb-3 mb-md-0"
            >
              {locale === "en" ? "Back to top" : "Volver arriba"}
            </a>
            <div className="d-flex align-items-center">
              <label
                htmlFor="footerSettingsLanguage"
                className="me-2 text-white"
              >
                {locale === "en" ? "Language" : "Idioma"}
              </label>
              <LanguageSwitcherSelect
                id="footerSettingsLanguage"
                className="form-select form-select-sm bg-transparent border-0"
                ariaLabel="Language selector"
              />
            </div>

            <div className="d-flex align-items-center">
              <label
                htmlFor="footerSettingsCurrency"
                className="ms-md-3 me-2 text-white"
              >
                {locale === "en" ? "Currency" : "Moneda"}
              </label>
              <select
                id="footerSettingsCurrency"
                className="form-select form-select-sm bg-transparent border-0"
                aria-label="Default select example"
                name="store-currency"
                defaultValue={currencyOptions[0].value}
              >
                {currencyOptions.map((option, index) => (
                  <option
                    key={index}
                    className="footer-select__option"
                    value={option.value}
                  >
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.d-flex --> */}
        <FooterSeoKeywords locale={locale} />
      </div>
      {/* <!-- /.footer-bottom container --> */}
    </footer>
  );
}
