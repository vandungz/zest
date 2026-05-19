import Button from "./common/Button"

export default function Hero({ onExplore }) {
  return (
    <section className="
      relative w-full overflow-hidden
      bg-[var(--color-bg-primary)]
      transition-colors duration-200
    "
      style={{ height: 'clamp(380px, 50vw, 520px)' }}
    >
      {/* ── BACKGROUND IMAGE ──────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80')`,
        }}
      />

      {/* ── GRADIENT OVERLAY ──────────────────────────────── */}
      {/* Light mode: bg-primary che phần trái, fade sang ảnh */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to right,
            var(--color-bg-primary) 30%,
            color-mix(in srgb, var(--color-bg-primary) 60%, transparent) 55%,
            transparent 75%
          )`,
        }}
      />

      {/* Bottom fade để blend vào section bên dưới */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background: `linear-gradient(to top, var(--color-bg-primary), transparent)`,
        }}
      />

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="
        relative z-10 h-full
        max-w-screen-xl mx-auto px-6
        flex flex-col justify-center
      ">
        {/* Eyebrow label */}
        <p className="
          text-xs font-semibold tracking-[0.2em] uppercase
          text-[var(--color-text-secondary)]
          mb-4
        ">
          Welcome to Zest
        </p>

        {/* Main heading — typography lớn, bold, editorial */}
        <h1 className="
          text-4xl sm:text-5xl lg:text-6xl
          font-black leading-[1.05] tracking-tight
          text-[var(--color-text-primary)]
          max-w-lg
        ">
          A Minimal Library
          <br />
          <span>for Curious</span>
          <br />
          <span>Readers</span>
        </h1>

        {/* Subheading */}
        <p className="
          mt-5 max-w-sm
          text-sm sm:text-base leading-relaxed
          text-[var(--color-text-secondary)]
        ">
          Browse over 1,000 curated books, search instantly,
          and build your personal reading cart.
        </p>

        {/* CTA Button */}
        <Button variant="primary" size="lg" onClick={onExplore} className="mt-8 gap-2">
          Explore Collection <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  )
}