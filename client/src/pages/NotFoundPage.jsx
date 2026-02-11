import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section>
      <h2>404 - Không tìm thấy trang</h2>
      <Link to="/home">Quay về trang chủ</Link>
    </section>
  );
}

export default NotFoundPage;
