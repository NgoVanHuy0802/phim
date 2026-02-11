import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const posterUrl = movie?.poster_url || movie?.thumb_url;

  return (
    <Link
      to={`/detail/${movie.slug}`}
      className="group block overflow-hidden rounded-xl bg-netflix-card shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white md:text-base">{movie.name}</h3>
      </div>
    </Link>
  );
}

export default MovieCard;
