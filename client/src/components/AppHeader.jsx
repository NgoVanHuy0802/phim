import { NavLink } from 'react-router-dom';

function AppHeader() {
  return (
    <header className="app-header">
      <h1>Phim App</h1>
      <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </header>
  );
}

export default AppHeader;
