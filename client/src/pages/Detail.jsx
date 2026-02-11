import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

/**
 * Detail page:
 * - Lấy slug từ URL
 * - Gọi API /api/phim/:slug
 * - Hiển thị thông tin phim
 * - Hiển thị danh sách tập
 * - Click tập => chuyển sang trang Watch
 */
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

  const handleWatchEpisode = (serverName, episodeSlug) => {
    navigate(`/watch/${slug}/${episodeSlug}`, {
      state: { serverName },
    });
  };

  if (loading) {
    return <p>Đang tải chi tiết phim...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (!movie) {
    return <p className="error-message">Không tìm thấy dữ liệu phim.</p>;
  }

  return (
    <section className="detail-page">
      <Link to="/home" className="back-link">
        ← Quay về trang chủ
      </Link>

      <div className="detail-header">
        <img
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          className="detail-poster"
          loading="lazy"
        />

        <div className="detail-meta">
          <h2>{movie.name}</h2>
          {movie.origin_name ? <p><strong>Tên gốc:</strong> {movie.origin_name}</p> : null}
          {movie.year ? <p><strong>Năm:</strong> {movie.year}</p> : null}
          {movie.quality ? <p><strong>Chất lượng:</strong> {movie.quality}</p> : null}
          {movie.lang ? <p><strong>Ngôn ngữ:</strong> {movie.lang}</p> : null}
          {movie.content ? <p><strong>Mô tả:</strong> {movie.content}</p> : null}
        </div>
      </div>

      <div className="episodes-section">
        <h3>Danh sách tập</h3>

        {episodes.length === 0 ? (
          <p>Phim hiện chưa có tập để xem.</p>
        ) : (
          episodes.map((server) => (
            <div key={server.server_name} className="episode-server">
              <h4>{server.server_name}</h4>
              <div className="episode-grid">
                {(server.server_data || []).map((episode) => (
                  <button
                    key={episode.slug || episode.name}
                    type="button"
                    className="episode-button"
                    onClick={() => handleWatchEpisode(server.server_name, episode.slug)}
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
