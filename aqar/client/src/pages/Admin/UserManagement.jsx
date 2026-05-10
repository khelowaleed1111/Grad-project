import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const ROLE_COLORS = {
  admin: 'bg-[#ffdad6] text-[#93000a]',
  owner: 'bg-[#e8f5e9] text-[#1b5e20]',
  agent: 'bg-[#fff8e1] text-[#835400]',
  buyer: 'bg-[#f0eded] text-[#41493e]',
};

const ROLE_ICONS = {
  admin: 'shield',
  owner: 'home',
  agent: 'business_center',
  buyer: 'person',
};

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.changeUserRole(id, role),
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Role change failed'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const users = usersData?.data || [];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      roleChangeMutation.mutate({ id: userId, role: newRole });
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    ) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1 text-sm text-[#717a6d] mb-4">
            <Link to="/admin" className="hover:text-[#00450d]">
              Admin Dashboard
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#41493e]">User Management</span>
          </nav>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c]">
            User Management
          </h1>
          <p className="text-sm text-[#41493e] mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#c0c9bb] p-4 mb-6 shadow-ambient-1">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2.5 pl-10 border-2 border-[#c0c9bb] rounded-xl text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717a6d] text-[20px]">
                  search
                </span>
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {['', 'buyer', 'owner', 'agent', 'admin'].map((role) => (
                <button
                  key={role || 'all'}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    roleFilter === role
                      ? 'bg-[#1b5e20] text-white'
                      : 'border-2 border-[#c0c9bb] text-[#41493e] hover:bg-[#f5f3f3]'
                  }`}
                >
                  {role || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-[#41493e]">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <Spinner center />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#c0c9bb] p-16 text-center shadow-ambient-1">
            <span className="material-symbols-outlined text-[64px] text-[#c0c9bb] block mb-4">
              person_search
            </span>
            <h2 className="font-semibold text-[#1b1c1c] text-xl mb-2">No users found</h2>
            <p className="text-sm text-[#41493e]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c0c9bb] bg-[#f5f3f3]">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c0c9bb]/40">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-[#f5f3f3] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1b5e20] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-[#1b1c1c]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#41493e]">{user.email}</td>
                      <td className="px-4 py-3 text-[#41493e]">{user.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={roleChangeMutation.isPending}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer transition-colors ${
                            ROLE_COLORS[user.role]
                          } disabled:opacity-60`}
                        >
                          {['buyer', 'owner', 'agent', 'admin'].map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-[#41493e] text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deleteUserMutation.isPending}
                          className="p-2 text-[#41493e] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/30 transition-colors disabled:opacity-60"
                          title="Delete user"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#c0c9bb]/40">
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#1b5e20] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1b1c1c] mb-1">{user.name}</h3>
                      <p className="text-sm text-[#41493e] truncate">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-[#717a6d] mt-0.5">{user.phone}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      disabled={deleteUserMutation.isPending}
                      className="p-2 text-[#41493e] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/30 transition-colors disabled:opacity-60 flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#717a6d]">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={roleChangeMutation.isPending}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer ${
                        ROLE_COLORS[user.role]
                      } disabled:opacity-60`}
                    >
                      {['buyer', 'owner', 'agent', 'admin'].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
