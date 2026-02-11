import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';
import Detail from './pages/Detail';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Watch from './pages/Watch';

function App() {
  return (
    <div className="min-h-screen bg-netflix-bg text-white">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 md:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />

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
