import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

/**
 * Watch page:
 * - Lấy slug + episodeSlug từ URL
 * - Gọi API /api/phim/:slug để lấy danh sách tập
 * - Tìm link .m3u8 của tập tương ứng
 * - Dùng hls.js để phát video
 * - Có loading state và nút quay lại
 */
function Watch() {
  const { slug, episodeSlug } = useParams();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!slug || !episodeSlug) {
        setErrorMessage('Thông tin tập phim không hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const response = await api.get(`/phim/${slug}`);
        setMovieData(response?.data?.data || null);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Không thể tải dữ liệu tập phim.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [slug, episodeSlug]);

  const selectedEpisode = useMemo(() => {
    const episodes = movieData?.episodes || [];

    for (const server of episodes) {
      const item = (server.server_data || []).find((episode) => episode.slug === episodeSlug);
      if (item) {
        return {
          ...item,
          serverName: server.server_name,
        };
      }
    }

    return null;
  }, [movieData, episodeSlug]);

  const streamUrl = selectedEpisode?.link_m3u8 || '';

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !streamUrl) {
      return undefined;
    }

    // cleanup instance cũ nếu có
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Safari / native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return undefined;
    }

    // Trình duyệt cần hls.js
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) {
          setErrorMessage('Không thể phát video. Vui lòng thử lại.');
        }
      });
    } else {
      setErrorMessage('Trình duyệt của bạn không hỗ trợ HLS playback.');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  if (loading) {
    return <p>Đang tải video...</p>;
  }

  if (errorMessage) {
    return (
      <section>
        <Link to={`/detail/${slug}`} className="back-link">
          ← Quay lại chi tiết phim
        </Link>
        <p className="error-message">{errorMessage}</p>
      </section>
    );
  }

  if (!selectedEpisode || !streamUrl) {
    return (
      <section>
        <Link to={`/detail/${slug}`} className="back-link">
          ← Quay lại chi tiết phim
        </Link>
        <p className="error-message">Không tìm thấy link phát cho tập này.</p>
      </section>
    );
  }

  return (
    <section className="watch-page">
      <Link to={`/detail/${slug}`} className="back-link">
        ← Quay lại chi tiết phim
      </Link>

      <h2>Xem phim</h2>
      <p>
        <strong>Tập:</strong> {selectedEpisode.name}
      </p>
      {selectedEpisode.serverName ? (
        <p>
          <strong>Server:</strong> {selectedEpisode.serverName}
        </p>
      ) : null}

      <div className="video-container">
        <video ref={videoRef} controls playsInline className="video-player" />
      </div>
    </section>
  );
}

export default Watch;
