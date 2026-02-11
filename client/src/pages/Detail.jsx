import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Detail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!slug) {
        setErrorMessage('Slug không hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');
        const response = await api.get(`/phim/${slug}`);
        setMovieData(response?.data?.data || null);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Không thể tải thông tin phim.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [slug]);

  const movie = useMemo(() => movieData?.movie || null, [movieData]);
  const episodes = useMemo(() => movieData?.episodes || [], [movieData]);

  const handleWatchEpisode = (episodeSlug) => {
    navigate(`/watch/${slug}/${episodeSlug}`);
  };

  if (loading) return <p className="text-netflix-muted">Đang tải chi tiết phim...</p>;
  if (errorMessage) return <p className="text-red-400">{errorMessage}</p>;
  if (!movie) return <p className="text-red-400">Không tìm thấy dữ liệu phim.</p>;

  return (
    <section className="space-y-5">
      <Link to="/home" className="inline-block text-sm text-netflix-muted transition hover:text-white">
        ← Quay về trang chủ
      </Link>

      <div className="grid gap-5 rounded-2xl border border-white/10 bg-[#181818] p-4 md:grid-cols-[260px_1fr] md:p-5">
        <img
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          className="w-full rounded-lg object-cover"
          loading="lazy"
        />

        <div className="space-y-2 text-sm text-netflix-muted">
          <h2 className="text-2xl font-bold text-white">{movie.name}</h2>
          {movie.origin_name ? <p><strong className="text-white">Tên gốc:</strong> {movie.origin_name}</p> : null}
          {movie.year ? <p><strong className="text-white">Năm:</strong> {movie.year}</p> : null}
          {movie.quality ? <p><strong className="text-white">Chất lượng:</strong> {movie.quality}</p> : null}
          {movie.lang ? <p><strong className="text-white">Ngôn ngữ:</strong> {movie.lang}</p> : null}
          {movie.content ? <p><strong className="text-white">Mô tả:</strong> {movie.content}</p> : null}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Danh sách tập</h3>

        {episodes.length === 0 ? (
          <p className="text-netflix-muted">Phim hiện chưa có tập để xem.</p>
        ) : (
          episodes.map((server) => (
            <div key={server.server_name} className="rounded-xl border border-white/10 bg-[#181818] p-4">
              <h4 className="mb-3 font-semibold text-white">{server.server_name}</h4>
              <div className="flex flex-wrap gap-2">
                {(server.server_data || []).map((episode) => (
                  <button
                    key={episode.slug || episode.name}
                    type="button"
                    onClick={() => handleWatchEpisode(episode.slug)}
                    className="rounded-md border border-white/20 bg-black/30 px-3 py-1.5 text-sm transition duration-300 hover:border-netflix-red hover:bg-netflix-red"
                  >
                    {episode.name}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Detail;
