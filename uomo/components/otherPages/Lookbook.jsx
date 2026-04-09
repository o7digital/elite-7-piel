import React from "react";
import Image from "next/image";
import Link from "next/link";

const lookbookItems = [
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-1.webp",
    width: 690,
    height: 399,
    price: "Desde $19",
    title: "Rutina facial diaria",
    alt: "Rutina facial diaria Elite 7 Piel",
    className:
      "lookbook-collection__item position-relative flex-grow-1 mb-4 effect border-plus",
  },
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-2.webp",
    width: 690,
    height: 399,
    price: "Desde $21",
    title: "Cuidado corporal y confort",
    alt: "Cuidado corporal Elite 7 Piel",
    className:
      "lookbook-collection__item position-relative flex-grow-1 mt-1 mb-4 effect border-plus",
  },
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-3.webp",
    width: 690,
    height: 826,
    price: "Desde $39",
    title: "Tecnologia estetica en casa",
    alt: "Tecnologia estetica para uso en casa",
    className:
      "lookbook-collection__item size-lg position-relative mb-4 effect border-plus",
  },
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-4.webp",
    width: 690,
    height: 826,
    price: "Desde $39",
    title: "Bienestar y autocuidado",
    alt: "Productos de bienestar y autocuidado",
    className:
      "lookbook-collection__item size-lg position-relative mt-1 mb-4 effect border-plus",
  },
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-5.webp",
    width: 690,
    height: 399,
    price: "Desde $19",
    title: "Esenciales para tu rutina",
    alt: "Esenciales de belleza Elite 7 Piel",
    className:
      "lookbook-collection__item position-relative flex-grow-1 mt-1 mb-4 effect border-plus",
  },
  {
    href: "/shop",
    src: "/assets/images/lookbook/lookbook-6.webp",
    width: 690,
    height: 399,
    price: "Desde $21",
    title: "Cuidado capilar diario",
    alt: "Cuidado capilar diario Elite 7 Piel",
    className:
      "lookbook-collection__item position-relative flex-grow-1 mt-1 mb-4 effect border-plus",
  },
];

function LookbookCard({ item, light = false }) {
  return (
    <Link href={item.href} className={item.className}>
      <div className="lookbook-collection__item-image">
        <Image
          loading="lazy"
          src={item.src}
          width={item.width}
          height={item.height}
          alt={item.alt}
        />
      </div>
      <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
        <p className={`text-uppercase mb-1${light ? " white-color" : ""}`}>
          {item.price}
        </p>
        <h2 className={light ? "white-color" : ""}>{item.title}</h2>
      </div>
    </Link>
  );
}

export default function Lookbook() {
  return (
    <>
      <section className="lookbook container">
        <h1 className="page-title">Lookbook</h1>
      </section>
      <section className="lookbook-collection">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex flex-column">
              <LookbookCard item={lookbookItems[0]} light />
              <LookbookCard item={lookbookItems[1]} />
            </div>
            <div className="col-lg-6">
              <LookbookCard item={lookbookItems[2]} />
            </div>
            <div className="col-lg-6">
              <LookbookCard item={lookbookItems[3]} />
            </div>
            <div className="col-lg-6 d-flex flex-column">
              <LookbookCard item={lookbookItems[4]} />
              <LookbookCard item={lookbookItems[5]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
