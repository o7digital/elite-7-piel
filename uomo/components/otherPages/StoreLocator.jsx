"use client";
import React, { useState } from "react";
import StoreMap from "./StoreMap";
import { storesLocations } from "@/data/storeLocations";

export default function StoreLocator() {
  const [getLocation, setLocation] = useState(storesLocations[0] || null);

  return (
    <section className="store-location container">
      <h1 className="page-title">Atencion y ubicacion</h1>
      <p className="mx-auto mb-4 text-center" style={{ maxWidth: "760px" }}>
        Nuestro canal principal de atencion esta disponible por WhatsApp y
        correo para dudas sobre productos, pedidos, envios y recomendaciones de
        compra.
      </p>

      <div className="row">
        <div className="col-lg-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="store-location__search">
              <input
                className="store-location__search-input"
                type="text"
                name="search-keyword"
                placeholder="Atencion en Ciudad de Mexico"
                readOnly
              />
              <button
                className="btn-icon store-location__search-btn"
                type="submit"
                aria-label="Buscar ubicacion"
              >
                <svg
                  className="d-block"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_search" />
                </svg>
              </button>
            </div>

            <div className="store-location__search-result">
              {storesLocations.map((elm) => (
                <div
                  key={elm.id}
                  className="store-location__search-result__item"
                >
                  <h2 className="fs-5">Atencion en {elm.city}</h2>
                  <p>
                    {elm.address}
                    <br />
                    {elm.country}
                    <br />
                    {elm.phone}
                    <br />
                    {elm.hours}
                    <br />
                    {elm.emailAddress}
                  </p>
                  <button
                    id={`store_selector_${elm.id}`}
                    type="button"
                    className="btn-link p-0 border-0 bg-transparent"
                    onClick={() => setLocation(elm)}
                  >
                    Ver en el mapa
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="google-map__wrapper">
            <StoreMap
              getLocation={getLocation}
              setLocation={setLocation}
              storesLocations={storesLocations}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
