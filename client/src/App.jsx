import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Detail from './pages/Detail';
import Watch from './pages/Watch';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes: yêu cầu token trong localStorage */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/detail/:slug" element={<Detail />} />
            <Route path="/watch/:slug/:episodeSlug" element={<Watch />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
