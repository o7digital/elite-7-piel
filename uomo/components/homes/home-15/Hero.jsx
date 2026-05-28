export default function Hero() {
  return (
    <section
      className="w-100"
      style={{
        lineHeight: 0,
        background: "#f3f3f3",
        overflow: "hidden",
      }}
    >
      <iframe
        src="/api/smart-slider-hero"
        title="Smart Slider 3 Hero"
        style={{
          width: "100%",
          height: "clamp(360px, 57.14vw, 800px)",
          border: 0,
          display: "block",
        }}
        loading="eager"
        allow="autoplay; fullscreen"
      />
    </section>
  );
}
