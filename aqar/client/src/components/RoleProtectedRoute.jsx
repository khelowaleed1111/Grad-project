import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

/**
 * RoleProtectedRoute Component
 * 
 * Protects routes that require specific user roles (e.g., admin, owner, agent).
 * - Redirects to /login if user is not authenticated
 * - Redirects to /unauthorized if user doesn't have required role
 * - Shows loading spinner while checking authentication
 * - Supports multiple allowed roles
 * 
 * @param {React.ReactNode} children - The protected content to render
 * @param {string|string[]} allowedRoles - Single role or array of roles that can access this route
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Spinner size="lg" center />;
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize allowedRoles to array for consistent checking
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has one of the required roles
  const hasRequiredRole = rolesArray.includes(user?.role);

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role, render the protected content
  return children;
};

export default RoleProtectedRoute;
