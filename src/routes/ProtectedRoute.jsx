import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

    try {
    const decoded = jwtDecode(token);

    // Token expired?
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  } catch (err) {
    console.error("Token validation error:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // return children;
}

export default ProtectedRoute;
