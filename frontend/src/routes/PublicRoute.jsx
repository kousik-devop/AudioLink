import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (user) {
    return user.role === "artist"
      ? <Navigate to="/artist/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
}
