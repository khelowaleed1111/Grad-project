import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-green-700" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{user?.role}</p>
            </div>
            
            {user?.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{user.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
