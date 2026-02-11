import { useEffect, useMemo, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import api from '../services/api';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await api.get('/phim-moi');
        const payload = response?.data?.data;

        // API có thể trả items ở nhiều shape khác nhau giữa các nguồn mirror.
        const items = payload?.items || payload?.data?.items || [];
        setMovies(Array.isArray(items) ? items : []);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Không thể tải danh sách phim mới.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

  const hasMovies = useMemo(() => movies.length > 0, [movies]);

  return (
    <section className="space-y-8 pb-10">
      <HeroBanner />

      <div>
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Phim mới cập nhật</h2>

        {loading ? <p className="text-netflix-muted">Đang tải danh sách phim...</p> : null}
        {errorMessage ? <p className="text-sm font-medium text-red-400">{errorMessage}</p> : null}

        {!loading && !errorMessage && !hasMovies ? (
          <p className="text-netflix-muted">Hiện chưa có dữ liệu phim.</p>
        ) : null}

        {hasMovies ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.slug || movie._id || movie.name} movie={movie} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HomePage;
