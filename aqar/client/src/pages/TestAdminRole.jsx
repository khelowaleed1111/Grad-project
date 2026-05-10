import { useAuth } from '../context/AuthContext';

/**
 * Test page to verify role-based protected routes
 * This page should only be accessible to admin users
 */
const TestAdminRole = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Admin Role Test Page
          </h1>

          <div className="space-y-4">
            {user && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Current User
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Name:</span> {user.name}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p>
                    <span className="font-medium">Role:</span>{' '}
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      {user.role}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✓ Role-Based Protection Test Passed
          </h3>
          <p className="text-green-800">
            If you can see this page, it means the RoleProtectedRoute component is working correctly.
            You have the required 'admin' role and were allowed to access this protected route.
          </p>
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Testing Instructions
          </h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>If you're an admin, you should see this page</li>
            <li>If you're not an admin, you should be redirected to /unauthorized</li>
            <li>If you're not logged in, you should be redirected to /login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAdminRole;
