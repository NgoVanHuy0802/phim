import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute:
 * - Kiểm tra token trong localStorage
 * - Không có token => redirect về /login
 * - Có token => render route con
 */
function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
