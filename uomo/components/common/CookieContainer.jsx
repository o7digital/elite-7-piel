"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "elite7piel-cookie-consent";

export default function CookieContainer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsVisible(storedConsent !== "accepted");
  }, []);

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookieConsentContainer" role="dialog" aria-live="polite">
      <div className="cookieConsentContainer__content">
        <div className="cookieDesc">
          <span className="cookieConsentContainer__eyebrow">Cookies</span>
          <p>
            Utilizamos cookies para mejorar tu experiencia, analizar la
            navegacion y recordar tus preferencias. Al continuar en el sitio,
            aceptas nuestra{" "}
            <Link href="/politica-de-cookies">Politica de Cookies</Link>.
          </p>
        </div>
        <div className="cookieButton">
          <Link href="/politica-de-cookies" className="cookieButton__secondary">
            Ver politica
          </Link>
          <button type="button" className="cookieButton__primary" onClick={acceptCookies}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
