"use client";
import Pagination1 from "../common/Pagination1";
import { blogs12, categories } from "@/data/blogs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function normalizeAuthor(author) {
  return author?.replace(/^By\s+/i, "") || "Equipo Elite 7 Piel";
}

export default function Blog1() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filteredBlogs, setFilteredBlogs] = useState(blogs12);

  useEffect(() => {
    if (activeCategory === "TODOS") {
      setFilteredBlogs(blogs12);
      return;
    }

    setFilteredBlogs(
      blogs12.filter((elm) => elm.category.includes(activeCategory))
    );
  }, [activeCategory]);

  return (
    <>
      <section className="blog-page-title mb-4 mb-xl-5">
        <div className="title-bg">
          <Image
            loading="lazy"
            src="/assets/images/blog_title_bg.webp"
            width="1780"
            height="420"
            alt="Portada del blog de Elite 7 Piel"
          />
        </div>
        <div className="container">
          <h1 className="page-title">Blog de belleza</h1>
          <div className="blog__filter">
            {categories.map((elm) => (
              <button
                type="button"
                onClick={() => setActiveCategory(elm)}
                key={elm}
                className={`menu-link menu-link_us-s border-0 bg-transparent p-0 ${
                  activeCategory === elm ? "menu-link_active" : ""
                }`}
              >
                {elm}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="blog-page container">
        <h2 className="d-none">Articulos de belleza y cuidado personal</h2>
        <div className="blog-grid row row-cols-1 row-cols-md-2">
          {filteredBlogs.map((elm) => (
            <article key={elm.id} className="blog-grid__item">
              <div className="blog-grid__item-image">
                <Image
                  loading="lazy"
                  className="h-auto"
                  src={elm.imgSrc}
                  width="690"
                  height="500"
                  alt={elm.title}
                />
              </div>
              <div className="blog-grid__item-detail">
                <div className="blog-grid__item-meta">
                  <span className="blog-grid__item-meta__author">
                    Por {normalizeAuthor(elm.author)}
                  </span>
                  <span className="blog-grid__item-meta__date">{elm.date}</span>
                </div>
                <div className="blog-grid__item-title">
                  <Link href={`/blog_single/${elm.id}`}>{elm.title}</Link>
                </div>
                <div className="blog-grid__item-content">
                  <p>{elm.content}</p>
                  <Link
                    href={`/blog_single/${elm.id}`}
                    className="readmore-link"
                  >
                    Seguir leyendo
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mb-5 text-center fw-medium">
          Mostrando {filteredBlogs.length} articulos
        </p>
        <Pagination1 />

        <div className="text-center">
          <a className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Ver mas
          </a>
        </div>
      </section>
    </>
  );
}
