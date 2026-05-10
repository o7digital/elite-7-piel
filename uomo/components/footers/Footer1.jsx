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
import FooterSeoKeywords from "@/components/common/FooterSeoKeywords";
import { getLocaleFromPath } from "@/lib/i18n/locale";
import { usePathname } from "next/navigation";

export default function Footer1() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
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
      message: "Enviando...",
    });

    try {
      await submitFormspree(formData);
      form.reset();
      setNewsletterStatus({
        type: "success",
        message: "Gracias. Tu suscripcion fue enviada.",
      });
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: error.message || "No se pudo enviar el formulario.",
      });
    }
  };

  return (
    <footer className="footer footer_type_1">
      <div className="footer-middle container">
        <div className="row row-cols-lg-4 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            <div className="logo">
              <Link href="/" className="site-wordmark site-wordmark_footer">
                ELITE 7 PIEL
              </Link>
            </div>
            {/* <!-- /.logo --> */}
            <p className="m-0">
              <strong className="fw-medium">
                <a
                  href="mailto:ventas@elite7piel.com"
                  className="text-reset text-decoration-none"
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
            <h5 className="sub-menu__title text-uppercase">Company</h5>
            <ul className="sub-menu__list list-unstyled">
              {footerLinks1.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link href={elm.href} className="menu-link menu-link_us-s">
                    {elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h5 className="sub-menu__title text-uppercase">Help</h5>
            <ul className="sub-menu__list list-unstyled">
              {footerLinks3.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link href={elm.href} className="menu-link menu-link_us-s">
                    {elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}
          <div className="footer-column footer-newsletter col-12 mb-4 mb-lg-0">
            <h5 className="sub-menu__title text-uppercase">Subscribe</h5>
            <p>
              Be the first to get the latest news about trends, promotions, and
              much more!
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
                {newsletterStatus.type === "loading" ? "Enviando..." : "Enviar"}
              </button>
            </form>
            {newsletterStatus.message ? (
              <p
                className={`mt-2 mb-0 small ${
                  newsletterStatus.type === "error" ? "text-danger" : "text-success"
                }`}
              >
                {newsletterStatus.message}
              </p>
            ) : null}

            <div className="mt-4 pt-3">
              <strong className="fw-medium">Pagos seguros</strong>
              <div className="mt-3 d-flex flex-wrap gap-2">
                <span className="border rounded-pill px-3 py-2 fw-medium">
                  VISA
                </span>
                <span className="border rounded-pill px-3 py-2 fw-medium">
                  MasterCard
                </span>
                <span className="border rounded-pill px-3 py-2 fw-medium">
                  AMEX
                </span>
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
              className="text-reset text-decoration-none"
            >
              created by o7digital.com
            </a>
          </div>
          <div className="footer-settings d-block d-md-flex align-items-center">
            <div className="d-flex align-items-center">
              <label
                htmlFor="footerSettingsLanguage"
                className="me-2 text-secondary"
              >
                Language
              </label>
              <LanguageSwitcherSelect
                id="footerSettingsLanguage"
                className="form-select form-select-sm bg-transparent"
                ariaLabel="Language selector"
              />
            </div>

            <div className="d-flex align-items-center">
              <label
                htmlFor="footerSettingsCurrency"
                className="ms-md-3 me-2 text-secondary"
              >
                Currency
              </label>
              <select
                id="footerSettingsCurrency"
                className="form-select form-select-sm bg-transparent"
                aria-label="Default select example"
                name="store-language"
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
