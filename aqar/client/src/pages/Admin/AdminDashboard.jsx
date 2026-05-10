import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/admin' },
  { id: 'listings', label: 'All Listings', icon: 'home_work', path: '/admin' },
  { id: 'pending', label: 'Pending', icon: 'pending_actions', path: '/admin/pending' },
  { id: 'users', label: 'Users', icon: 'people', path: '/admin/users' },
];

const ROLE_COLORS = {
  admin: 'bg-[#ffdad6] text-[#93000a]',
  owner: 'bg-[#e8f5e9] text-[#1b5e20]',
  agent: 'bg-[#fff8e1] text-[#835400]',
  buyer: 'bg-[#f0eded] text-[#41493e]',
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('overview');

  // Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  });

  // All listings
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: () => adminApi.getAllListings().then((r) => r.data),
    enabled: tab === 'listings',
  });

  // Pending listings
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: () => adminApi.getPendingListings().then((r) => r.data),
    enabled: tab === 'pending',
  });

  // Users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
    enabled: tab === 'users',
  });

  const approveMutation = useMutation({
    mutationFn: (id) => adminApi.approveListing(id),
    onSuccess: () => {
      toast.success('Listing approved!');
      queryClient.invalidateQueries({ queryKey: ['admin-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Approval failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => adminApi.rejectListing(id),
    onSuccess: () => {
      toast.success('Listing rejected and removed');
      queryClient.invalidateQueries({ queryKey: ['admin-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Rejection failed'),
  });

  const featureMutation = useMutation({
    mutationFn: (id) => adminApi.toggleFeature(id),
    onSuccess: () => {
      toast.success('Featured status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.changeUserRole(id, role),
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Role change failed'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const stats = statsData?.data;
  const listings = listingsData?.data || [];
  const pending = pendingData?.data || [];
  const users = usersData?.data || [];

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c]">Admin Dashboard</h1>
            <p className="text-sm text-[#41493e] mt-1">Manage listings, users, and platform settings</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-sm text-[#ba1a1a] border border-[#ba1a1a] px-4 py-2 rounded-xl hover:bg-[#ffdad6]/30 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <nav className="bg-white rounded-2xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
              {NAV_ITEMS.map((item) => {
                const isExternal = item.id === 'pending' || item.id === 'users';
                const Component = isExternal ? Link : 'button';
                const props = isExternal 
                  ? { to: item.path }
                  : { type: 'button', onClick: () => setTab(item.id) };
                
                return (
                  <Component
                    key={item.id}
                    {...props}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-l-4 ${
                      tab === item.id
                        ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20]'
                        : 'border-transparent text-[#41493e] hover:bg-[#f5f3f3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                    {item.id === 'pending' && stats?.properties?.pending > 0 && (
                      <span className="ml-auto bg-[#ba1a1a] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {stats.properties.pending}
                      </span>
                    )}
                  </Component>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {statsLoading ? <Spinner center /> : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: 'people', label: 'Total Users', value: stats?.users?.total ?? 0, sub: `${stats?.users?.buyers ?? 0} buyers`, color: 'text-[#1b5e20]', bg: 'bg-[#e8f5e9]' },
                        { icon: 'home_work', label: 'Properties', value: stats?.properties?.total ?? 0, sub: `${stats?.properties?.featured ?? 0} featured`, color: 'text-[#835400]', bg: 'bg-[#fff8e1]' },
                        { icon: 'pending_actions', label: 'Pending', value: stats?.properties?.pending ?? 0, sub: 'Awaiting review', color: 'text-[#ba1a1a]', bg: 'bg-[#ffdad6]' },
                        { icon: 'mail', label: 'Inquiries', value: stats?.inquiries ?? 0, sub: 'Total received', color: 'text-[#1b5e20]', bg: 'bg-[#e8f5e9]' },
                      ].map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#c0c9bb] shadow-ambient-1">
                          <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                          </div>
                          <div className={`font-['Playfair_Display'] text-3xl font-bold ${s.color}`}>{s.value}</div>
                          <div className="text-sm font-medium text-[#1b1c1c] mt-1">{s.label}</div>
                          <div className="text-xs text-[#41493e]">{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Role breakdown */}
                    <div className="bg-white rounded-2xl border border-[#c0c9bb] p-6 shadow-ambient-1">
                      <h3 className="font-semibold text-[#1b1c1c] mb-4">User Breakdown</h3>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { role: 'buyer', count: stats?.users?.buyers },
                          { role: 'owner', count: stats?.users?.owners },
                          { role: 'agent', count: stats?.users?.agents },
                          { role: 'admin', count: stats?.users?.admins },
                        ].map((r) => (
                          <div key={r.role} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${ROLE_COLORS[r.role]}`}>
                            <span className="capitalize">{r.role}</span>
                            <span className="font-bold">{r.count ?? 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick actions */}
                    {stats?.properties?.pending > 0 && (
                      <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#ba1a1a]">pending_actions</span>
                          <div>
                            <p className="font-semibold text-[#1b1c1c]">{stats.properties.pending} listings awaiting review</p>
                            <p className="text-sm text-[#41493e]">Review and approve or reject pending property submissions.</p>
                          </div>
                        </div>
                        <Link to="/admin/pending"
                          className="bg-[#ba1a1a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0">
                          Review Now
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ALL LISTINGS */}
            {tab === 'listings' && (
              <div className="space-y-4">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c]">All Listings</h2>
                {listingsLoading ? <Spinner center /> : (
                  <div className="bg-white rounded-2xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c0c9bb] bg-[#f5f3f3]">
                          {['Property', 'Owner', 'Price', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c0c9bb]/40">
                        {listings.map((l) => (
                          <tr key={l._id} className="hover:bg-[#f5f3f3] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {l.images?.[0] && (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-[#1b1c1c] truncate max-w-[180px]">{l.title}</p>
                                  <p className="text-xs text-[#41493e]">{l.location?.city}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#41493e]">{l.owner?.name || '—'}</td>
                            <td className="px-4 py-3 font-semibold text-[#00450d]">{formatPrice(l.price)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${l.isApproved ? 'bg-[#e8f5e9] text-[#1b5e20]' : 'bg-[#fff8e1] text-[#835400]'}`}>
                                  {l.isApproved ? 'Approved' : 'Pending'}
                                </span>
                                {l.isFeatured && (
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#fcab28]/20 text-[#835400] w-fit">⭐ Featured</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link to={`/properties/${l._id}`}
                                  className="p-1.5 text-[#41493e] hover:text-[#1b5e20] rounded-lg hover:bg-[#e8f5e9] transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </Link>
                                <button onClick={() => featureMutation.mutate(l._id)}
                                  title="Toggle featured"
                                  className={`p-1.5 rounded-lg transition-colors ${l.isFeatured ? 'text-[#835400] hover:bg-[#fff8e1]' : 'text-[#41493e] hover:bg-[#f0eded]'}`}>
                                  <span className="material-symbols-outlined text-[18px]">stars</span>
                                </button>
                                <button onClick={() => { if (window.confirm('Delete this listing?')) rejectMutation.mutate(l._id); }}
                                  className="p-1.5 text-[#41493e] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/30 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {listings.length === 0 && (
                      <div className="text-center py-12 text-[#41493e]">No listings found.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PENDING */}
            {tab === 'pending' && (
              <div className="space-y-4">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c]">Pending Reviews</h2>
                {pendingLoading ? <Spinner center /> : pending.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-[#c0c9bb]">
                    <span className="material-symbols-outlined text-[48px] text-[#91d78a] block mb-3">task_alt</span>
                    <p className="font-semibold text-[#1b1c1c]">All caught up!</p>
                    <p className="text-sm text-[#41493e]">No listings waiting for review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map((p) => (
                      <div key={p._id} className="bg-white rounded-2xl border border-[#c0c9bb] p-5 shadow-ambient-1">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#eae8e7]">
                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-[#1b1c1c]">{p.title}</h3>
                                <p className="text-sm text-[#41493e]">{p.location?.address}, {p.location?.city}</p>
                                <p className="font-bold text-[#00450d] mt-1">{formatPrice(p.price)}</p>
                                <p className="text-xs text-[#717a6d] mt-1">
                                  Submitted by <span className="font-medium text-[#1b1c1c]">{p.owner?.name}</span>
                                  {' · '}{new Date(p.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Link to={`/properties/${p._id}`}
                                  className="flex items-center gap-1 px-3 py-2 border border-[#c0c9bb] rounded-xl text-xs font-medium text-[#41493e] hover:bg-[#f5f3f3] transition-colors">
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>View
                                </Link>
                                <button onClick={() => approveMutation.mutate(p._id)}
                                  disabled={approveMutation.isPending}
                                  className="flex items-center gap-1 px-3 py-2 bg-[#1b5e20] text-white rounded-xl text-xs font-medium hover:bg-[#00450d] transition-colors disabled:opacity-60">
                                  <span className="material-symbols-outlined text-[16px]">check</span>Approve
                                </button>
                                <button onClick={() => { if (window.confirm('Reject and delete this listing?')) rejectMutation.mutate(p._id); }}
                                  disabled={rejectMutation.isPending}
                                  className="flex items-center gap-1 px-3 py-2 bg-[#ba1a1a] text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                                  <span className="material-symbols-outlined text-[16px]">close</span>Reject
                                </button>
                              </div>
                            </div>
                            {p.description && (
                              <p className="text-xs text-[#41493e] mt-2 line-clamp-2">{p.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="space-y-4">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c]">User Management</h2>
                {usersLoading ? <Spinner center /> : (
                  <div className="bg-white rounded-2xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c0c9bb] bg-[#f5f3f3]">
                          {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#41493e]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c0c9bb]/40">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-[#f5f3f3] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#1b5e20] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {u.name?.[0]}
                                </div>
                                <span className="font-medium text-[#1b1c1c]">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#41493e]">{u.email}</td>
                            <td className="px-4 py-3">
                              <select
                                value={u.role}
                                onChange={(e) => roleChangeMutation.mutate({ id: u._id, role: e.target.value })}
                                className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${ROLE_COLORS[u.role]}`}
                              >
                                {['buyer', 'owner', 'agent', 'admin'].map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-[#41493e] text-xs">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => { if (window.confirm(`Delete ${u.name}?`)) deleteUserMutation.mutate(u._id); }}
                                className="p-1.5 text-[#41493e] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/30 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
