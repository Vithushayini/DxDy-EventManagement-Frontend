import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function isJwtExpired(token) {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return false;
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return Boolean(payload.exp && payload.exp < Date.now() / 1000);
  } catch (err) {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isJwtExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
