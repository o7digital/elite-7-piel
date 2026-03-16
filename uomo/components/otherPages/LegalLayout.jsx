"use client";

import React from "react";

export default function LegalLayout({
  title,
  intro,
  details = [],
  notice,
  children,
}) {
  return (
    <section className="legal-page container">
      <div className="mw-930">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="legal-page__shell mw-930">
        <div className="legal-page__panel legal-page__panel_intro">
          <p className="legal-page__intro">{intro}</p>

          {details.length ? (
            <div className="legal-page__details">
              {details.map((detail) => (
                <div key={detail.label} className="legal-page__detail">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
          ) : null}

          {notice ? <div className="legal-page__notice">{notice}</div> : null}
        </div>

        <div className="legal-page__panel legal-page__panel_content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          padding-bottom: 5rem;
        }

        .legal-page__shell {
          display: grid;
          gap: 2rem;
        }

        .legal-page__panel {
          border: 1px solid #e9e9e9;
          background: #fff;
          padding: 2rem;
        }

        .legal-page__panel_intro {
          background: linear-gradient(180deg, #fff 0%, #fbf8f7 100%);
        }

        .legal-page__intro {
          margin: 0;
          color: #555;
          font-size: 1.02rem;
          line-height: 1.8;
        }

        .legal-page__details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          margin-top: 1.75rem;
        }

        .legal-page__detail {
          display: grid;
          gap: 0.3rem;
          padding: 1rem 1.1rem;
          border: 1px solid #ececec;
          background: #fff;
        }

        .legal-page__detail span {
          color: #7a7a7a;
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .legal-page__detail strong {
          color: #202020;
          font-size: 1rem;
          font-weight: 600;
          word-break: break-word;
        }

        .legal-page__notice {
          margin-top: 1rem;
          padding: 1rem 1.1rem;
          border-left: 4px solid #202020;
          background: #fff;
          color: #444;
          line-height: 1.8;
          white-space: pre-line;
        }

        .legal-page__panel_content :global(h2) {
          margin: 0 0 0.9rem;
          color: #1c1c1c;
          font-size: 1.45rem;
          font-weight: 700;
        }

        .legal-page__panel_content :global(h3) {
          margin: 2rem 0 0.75rem;
          color: #1f1f1f;
          font-size: 1.08rem;
          font-weight: 700;
        }

        .legal-page__panel_content :global(p) {
          margin: 0 0 1rem;
          color: #555;
          line-height: 1.85;
        }

        .legal-page__panel_content :global(ul) {
          margin: 0 0 1rem;
          padding-left: 1.2rem;
          color: #555;
        }

        .legal-page__panel_content :global(li) {
          margin-bottom: 0.55rem;
          line-height: 1.75;
        }

        .legal-page__panel_content :global(a) {
          color: #202020;
          text-decoration: underline;
        }

        @media (max-width: 767px) {
          .legal-page__panel {
            padding: 1.35rem;
          }

          .legal-page__details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
