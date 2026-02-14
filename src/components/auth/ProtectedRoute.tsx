import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { token, user, loading } = useAuth(); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;