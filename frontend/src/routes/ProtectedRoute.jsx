import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // 🔒 BLOCK routing until auth is ready
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Checking session...
      </div>
    );
  }

  // ❌ Only redirect AFTER loading finished
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔁 Role protection
  if (allowedRole && user.role !== allowedRole) {
    return user.role === "artist"
      ? <Navigate to="/artist/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
}
