import { NavLink } from 'react-router-dom';

function AppHeader() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors duration-300 ${
      isActive ? 'text-white' : 'text-netflix-muted hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <NavLink to="/home" className="text-2xl font-extrabold tracking-widest text-netflix-red">
          NETPHIM
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink to="/home" className={linkClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Yêu thích
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Đăng nhập
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
