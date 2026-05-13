import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '../../api/propertiesApi';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/property/PropertyCard';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'listings', label: 'My Listings', icon: 'home_work' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

export default function UserDashboard() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const { data: listingsData, isLoading: listLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => propertiesApi.getMyListings().then((r) => r.data),
    enabled: ['owner', 'agent'].includes(user?.role),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => propertiesApi.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const profileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: (res) => {
      updateUser(res.data.data);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Update failed'),
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this listing?')) deleteMutation.mutate(id);
  };

  const listings = listingsData?.data || [];

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <div className="max-w-[1140px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c]">
              Welcome, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-[#41493e] mt-1 capitalize">{user?.role} Account</p>
          </div>
          {['owner', 'agent'].includes(user?.role) && (
            <Link to="/dashboard/listings/new"
              className="flex items-center gap-2 bg-[#1b5e20] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#00450d] transition-all hover:-translate-y-0.5 shadow-sm text-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Listing
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <nav className="bg-white rounded-2xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-l-4 ${
                    tab === t.id
                      ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20]'
                      : 'border-transparent text-[#41493e] hover:bg-[#f5f3f3]'
                  }`}>
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                  {t.label}
                </button>
              ))}
              <div className="border-t border-[#c0c9bb]">
                <button onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors text-left">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Mobile tabs */}
          <div className="md:hidden w-full mb-4 flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  tab === t.id ? 'bg-[#1b5e20] text-white' : 'border border-[#c0c9bb] text-[#41493e]'
                }`}>
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: 'home_work', label: 'My Listings', value: listings.length, color: 'text-[#1b5e20]', bg: 'bg-[#e8f5e9]' },
                    { icon: 'pending', label: 'Pending Approval', value: listings.filter(l => !l.isApproved).length, color: 'text-[#835400]', bg: 'bg-[#fff8e1]' },
                    { icon: 'visibility', label: 'Total Views', value: listings.reduce((sum, l) => sum + (l.views || 0), 0), color: 'text-[#1b5e20]', bg: 'bg-[#e8f5e9]' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#c0c9bb] shadow-ambient-1">
                      <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-3`}>
                        <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                      </div>
                      <div className={`font-['Playfair_Display'] text-3xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-sm text-[#41493e] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {listings.length > 0 && (
                  <div>
                    <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1b1c1c] mb-4">Recent Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listings.slice(0, 4).map((p) => <PropertyCard key={p._id} property={p} />)}
                    </div>
                  </div>
                )}

                {listings.length === 0 && ['owner', 'agent'].includes(user?.role) && (
                  <div className="bg-white rounded-2xl p-10 border border-[#c0c9bb] text-center">
                    <span className="material-symbols-outlined text-[64px] text-[#c0c9bb] block mb-4">add_home</span>
                    <h3 className="font-semibold text-[#1b1c1c] mb-2">No listings yet</h3>
                    <p className="text-sm text-[#41493e] mb-5">Start by creating your first property listing.</p>
                    <Link to="/dashboard/listings/new"
                      className="bg-[#1b5e20] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#00450d] transition-colors text-sm">
                      Create Listing
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* MY LISTINGS */}
            {tab === 'listings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c]">My Listings</h2>
                  {['owner', 'agent'].includes(user?.role) && (
                    <Link to="/dashboard/listings/new"
                      className="flex items-center gap-1.5 text-sm font-medium text-[#1b5e20] hover:underline">
                      <span className="material-symbols-outlined text-[18px]">add</span>Add New
                    </Link>
                  )}
                </div>

                {listLoading ? <Spinner center /> : listings.length === 0 ? (
                  <div className="text-center py-16 text-[#41493e]">
                    <span className="material-symbols-outlined text-[48px] text-[#c0c9bb] block mb-3">home_work</span>
                    No listings found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((p) => (
                      <div key={p._id} className="bg-white rounded-2xl border border-[#c0c9bb] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-ambient-1">
                        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#eae8e7]">
                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#1b1c1c] truncate">{p.title}</h3>
                            <p className="text-sm text-[#41493e]">{p.location?.city}</p>
                            <p className="font-bold text-[#00450d] text-sm">
                              {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(p.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end sm:flex-shrink-0 border-t sm:border-t-0 border-[#e4e2e1] pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            p.isApproved ? 'bg-[#e8f5e9] text-[#1b5e20]' : 'bg-[#fff8e1] text-[#835400]'
                          }`}>
                            {p.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          <Link to={`/properties/${p._id}`}
                            className="p-2 text-[#41493e] hover:text-[#1b5e20] rounded-lg hover:bg-[#f0eded] transition-colors"
                            title="View property">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                          <Link to={`/dashboard/listings/edit/${p._id}`}
                            className="p-2 text-[#41493e] hover:text-[#1b5e20] rounded-lg hover:bg-[#f0eded] transition-colors"
                            title="Edit property">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                          <button onClick={() => handleDelete(p._id)}
                            className="p-2 text-[#41493e] hover:text-[#ba1a1a] rounded-lg hover:bg-[#ffdad6]/30 transition-colors"
                            title="Delete property">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {tab === 'profile' && (
              <div className="bg-white rounded-2xl border border-[#c0c9bb] p-6 shadow-ambient-1 max-w-lg">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-6">Edit Profile</h2>
                <div className="flex items-center gap-4 mb-6 p-4 bg-[#f5f3f3] rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-[#1b5e20] flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1b1c1c]">{user?.name}</p>
                    <p className="text-sm text-[#41493e]">{user?.email}</p>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1b5e20] capitalize">{user?.role}</span>
                  </div>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(profileForm); }} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-2">Full Name</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-2">Phone Number</label>
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]" />
                  </div>
                  <button type="submit" disabled={profileMutation.isPending}
                    className="bg-[#1b5e20] text-white py-3 rounded-xl font-semibold hover:bg-[#00450d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {profileMutation.isPending
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
