import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/auth/auth-context";

export default function ProtectedRouteWrapper() {
  const { user, authLoading } = useAuth();
  const location = useLocation();


  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
