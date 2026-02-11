import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

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
      if (item) return { ...item, serverName: server.server_name };
    }
    return null;
  }, [movieData, episodeSlug]);

  const streamUrl = selectedEpisode?.link_m3u8 || '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return undefined;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return undefined;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) setErrorMessage('Không thể phát video. Vui lòng thử lại.');
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

  if (loading) return <p className="text-netflix-muted">Đang tải video...</p>;
  if (errorMessage) {
    return (
      <section>
        <Link to={`/detail/${slug}`} className="inline-block text-sm text-netflix-muted transition hover:text-white">
          ← Quay lại chi tiết phim
        </Link>
        <p className="mt-3 text-red-400">{errorMessage}</p>
      </section>
    );
  }
  if (!selectedEpisode || !streamUrl) {
    return (
      <section>
        <Link to={`/detail/${slug}`} className="inline-block text-sm text-netflix-muted transition hover:text-white">
          ← Quay lại chi tiết phim
        </Link>
        <p className="mt-3 text-red-400">Không tìm thấy link phát cho tập này.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <Link to={`/detail/${slug}`} className="inline-block text-sm text-netflix-muted transition hover:text-white">
        ← Quay lại chi tiết phim
      </Link>
      <h2 className="text-2xl font-bold">Xem phim</h2>
      <p className="text-sm text-netflix-muted">
        <strong className="text-white">Tập:</strong> {selectedEpisode.name}
      </p>
      {selectedEpisode.serverName ? (
        <p className="text-sm text-netflix-muted">
          <strong className="text-white">Server:</strong> {selectedEpisode.serverName}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl bg-black shadow-glow">
        <video ref={videoRef} controls playsInline className="aspect-video w-full bg-black" />
      </div>
    </section>
  );
}

export default Watch;
