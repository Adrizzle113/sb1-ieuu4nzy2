import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user role
  const userRole = user.user_metadata?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if authenticated but wrong role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}