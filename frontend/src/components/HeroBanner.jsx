function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10">
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80"
        alt="Cinema banner"
        className="h-[45vh] w-full object-cover md:h-[55vh]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="absolute bottom-0 left-0 w-full p-5 md:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-netflix-muted">Now Trending</p>
        <h1 className="max-w-3xl text-2xl font-extrabold leading-tight md:text-5xl">
          Thế giới phim ảnh với trải nghiệm dark mode phong cách Netflix
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-netflix-muted md:text-base">
          Khám phá phim mới cập nhật mỗi ngày, hover để xem hiệu ứng và mở chi tiết chỉ với một click.
        </p>
      </div>
    </section>
  );
}

export default HeroBanner;
