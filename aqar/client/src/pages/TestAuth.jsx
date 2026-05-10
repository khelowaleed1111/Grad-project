import { useAuth } from '../context/AuthContext';

/**
 * Test page to verify authentication context and protected routes
 * This page should only be accessible when authenticated
 */
const TestAuth = () => {
  const { user, token, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Authentication Test Page
          </h1>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Authentication Status
              </h2>
              <p className="text-gray-600">
                <span className="font-medium">Is Authenticated:</span>{' '}
                <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                  {isAuthenticated ? '✓ Yes' : '✗ No'}
                </span>
              </p>
            </div>

            {user && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  User Information
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Name:</span> {user.name}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Role:</span> {user.role}</p>
                  {user.phone && (
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                  )}
                </div>
              </div>
            )}

            {token && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  JWT Token
                </h2>
                <p className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-3 rounded">
                  {token}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ✓ Protected Route Test Passed
          </h3>
          <p className="text-blue-800">
            If you can see this page, it means the ProtectedRoute component is working correctly.
            You were authenticated and allowed to access this protected route.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
