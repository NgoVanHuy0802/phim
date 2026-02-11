import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Trang đăng nhập:
 * - Form username + password
 * - Gọi POST /login qua AuthContext
 * - Lưu JWT vào localStorage (thực hiện trong AuthContext)
 * - Redirect về /home khi thành công
 * - Hiển thị lỗi nếu thất bại
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate('/home', { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </section>
  );
}

export default Login;
