import { Link, useLocation, useParams } from 'react-router-dom';

/**
 * Trang Watch tối thiểu để nhận điều hướng từ Detail.
 * Có thể mở rộng sau để phát video từ link m3u8/embed.
 */
function Watch() {
  const { slug, episodeSlug } = useParams();
  const location = useLocation();

  return (
    <section>
      <Link to={`/detail/${slug}`} className="back-link">
        ← Quay lại chi tiết phim
      </Link>
      <h2>Trang xem phim</h2>
      <p><strong>Slug phim:</strong> {slug}</p>
      <p><strong>Tập:</strong> {episodeSlug}</p>
      {location.state?.serverName ? <p><strong>Server:</strong> {location.state.serverName}</p> : null}
    </section>
  );
}

export default Watch;
