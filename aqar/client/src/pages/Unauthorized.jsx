import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

/**
 * Unauthorized Page
 * 
 * Displayed when a user tries to access a route they don't have permission for.
 */
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-24 h-24 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b5e20] text-white rounded-lg hover:bg-[#2e7d32] transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
