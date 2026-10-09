export default function CatalogLoading() {
  return (
    <section className="container py-5" aria-busy="true" aria-label="Catálogo">
      <p role="status">Cargando productos…</p>
      <div className="row g-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="col-6 col-lg-3" key={index}>
            <div style={{ aspectRatio: "3 / 4", background: "#f3f3f3", borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </section>
  );
}
