import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setErrorMessage(error?.response?.data?.message || error?.message || 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 shadow-glow">
      <h2 className="mb-5 text-2xl font-bold">Đăng nhập</h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoComplete="username"
          className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none transition focus:border-netflix-red"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none transition focus:border-netflix-red"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 rounded-md bg-netflix-red px-4 py-2 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      {errorMessage ? <p className="mt-3 text-sm font-medium text-red-400">{errorMessage}</p> : null}
    </section>
  );
}

export default Login;
