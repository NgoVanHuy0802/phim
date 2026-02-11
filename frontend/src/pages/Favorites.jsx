import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getAuthConfig } from '../services/api';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await api.get('/favorites', getAuthConfig());
        setFavorites(Array.isArray(response?.data?.data) ? response.data.data : []);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Không thể tải danh sách yêu thích.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Phim yêu thích</h2>

      {loading ? <p className="text-netflix-muted">Đang tải danh sách...</p> : null}
      {errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}

      {!loading && !errorMessage && favorites.length === 0 ? (
        <p className="text-netflix-muted">Bạn chưa lưu phim yêu thích nào.</p>
      ) : null}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {favorites.map((movie) => (
            <Link
              key={`${movie.slug}-${movie._id}`}
              to={`/detail/${movie.slug}`}
              className="group block overflow-hidden rounded-xl bg-netflix-card shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_url || movie.thumb_url}
                  alt={movie.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white md:text-base">{movie.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Favorites;
