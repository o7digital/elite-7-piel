"use client";

import { seoKeywordContent } from "@/data/seoKeywordContent";
import { localizeKeyword } from "@/lib/seo/localizedKeywords";

export default function SeoKeywordContent() {
  return (
    <section className="seo-keyword-content container">
      <div className="seo-keyword-content__header">
        <p className="seo-keyword-content__eyebrow">Contenido destacado</p>
        <h2 className="seo-keyword-content__title">
          {seoKeywordContent.headingEs}
        </h2>
        <p className="seo-keyword-content__lead">{seoKeywordContent.introEs}</p>
      </div>

      <article className="seo-keyword-content__panel" lang="es">
        <span className="seo-keyword-content__badge">
          {seoKeywordContent.sectionLabelEs}
        </span>
        <h3 className="seo-keyword-content__panel-title">
          {seoKeywordContent.headingEs}
        </h3>
        <p className="seo-keyword-content__intro">{seoKeywordContent.introEs}</p>

        <div className="seo-keyword-content__topics">
          {seoKeywordContent.sections.map((section) => (
            <section key={section.id} className="seo-keyword-content__topic">
              <h4>{section.esTitle}</h4>
              <p>{section.esBody}</p>
              <ul
                className="seo-keyword-content__chips"
                aria-label={section.esTitle}
              >
                {section.esKeywords.map((keyword) => (
                  <li key={keyword}>{localizeKeyword(keyword)}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <style jsx>{`
        .seo-keyword-content {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }

        .seo-keyword-content__header {
          max-width: 860px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }

        .seo-keyword-content__eyebrow {
          margin: 0 0 0.75rem;
          color: #8a8a8a;
          font-size: 0.9rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .seo-keyword-content__title {
          margin: 0;
          font-size: clamp(2rem, 2vw + 1.35rem, 3.2rem);
          line-height: 1.08;
          color: #181818;
        }

        .seo-keyword-content__lead {
          margin: 1.25rem 0 0;
          color: #575757;
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .seo-keyword-content__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .seo-keyword-content__panel {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem;
          border: 1px solid #e5e0d8;
          background: #fffdf8;
        }

        .seo-keyword-content__badge {
          display: inline-flex;
          margin-bottom: 1rem;
          padding: 0.45rem 0.85rem;
          border: 1px solid #d9cdb9;
          color: #7a5d34;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .seo-keyword-content__panel-title {
          margin: 0;
          color: #1f1f1f;
          font-size: 1.55rem;
          line-height: 1.2;
        }

        .seo-keyword-content__intro {
          margin: 1rem 0 0;
          color: #5b5b5b;
          line-height: 1.75;
        }

        .seo-keyword-content__topics {
          display: grid;
          gap: 1.5rem;
          margin-top: 1.75rem;
        }

        .seo-keyword-content__topic h4 {
          margin: 0 0 0.55rem;
          color: #202020;
          font-size: 1.1rem;
        }

        .seo-keyword-content__topic p {
          margin: 0;
          color: #5f5f5f;
          line-height: 1.75;
        }

        .seo-keyword-content__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 1rem 0 0;
          padding: 0;
          list-style: none;
        }

        .seo-keyword-content__chips li {
          padding: 0.55rem 0.8rem;
          background: #ffffff;
          border: 1px solid #e7dfd1;
          color: #3f3f3f;
          font-size: 0.92rem;
          line-height: 1.35;
        }

        @media (max-width: 991px) {
          .seo-keyword-content__panel {
            max-width: none;
          }
        }

        @media (max-width: 767px) {
          .seo-keyword-content {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }

          .seo-keyword-content__panel {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
