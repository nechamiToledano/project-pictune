import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const GuestRoute = ({ isAuthenticated, children }: GuestRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
