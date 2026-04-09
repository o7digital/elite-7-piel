import React from "react";
import Image from "next/image";

const reviews = [
  {
    name: "Mariana Torres",
    date: "09 abril 2026",
    text: "Me gusto que el articulo explica la rutina de forma clara y practica. Ayuda mucho cuando estas empezando a cuidar mejor tu piel.",
  },
  {
    name: "Daniela Cruz",
    date: "09 abril 2026",
    text: "Buen resumen para elegir productos sin complicarse. Se siente mas util que el contenido generico de muchos blogs de belleza.",
  },
];

export default function Reviews() {
  return (
    <div className="blog-single__reviews-list">
      {reviews.map((review) => (
        <div key={review.name} className="blog-single__reviews-item">
          <div className="customer-avatar">
            <Image
              loading="lazy"
              width={80}
              height={80}
              src="/assets/images/avatar.webp"
              alt={`Avatar de ${review.name}`}
            />
          </div>
          <div className="customer-review">
            <div className="customer-name">
              <h3 className="fs-6 mb-0">{review.name}</h3>
              <div className="reviews-group d-flex">
                <svg
                  className="review-star"
                  viewBox="0 0 9 9"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_star" />
                </svg>
                <svg
                  className="review-star"
                  viewBox="0 0 9 9"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_star" />
                </svg>
                <svg
                  className="review-star"
                  viewBox="0 0 9 9"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_star" />
                </svg>
                <svg
                  className="review-star"
                  viewBox="0 0 9 9"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_star" />
                </svg>
                <svg
                  className="review-star"
                  viewBox="0 0 9 9"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_star" />
                </svg>
              </div>
            </div>
            <div className="review-date">{review.date}</div>
            <div className="review-text">
              <p>{review.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
