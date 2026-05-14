// Updated: 2026-05-14 07:00:00 (Deployment Force Refresh)
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-2xl border border-[#c0c9bb] shadow-ambient-1">
          <span className="material-symbols-outlined text-[64px] text-[#ba1a1a] mb-4">lock</span>
          <h2 className="text-xl font-bold text-[#1b1c1c] mb-2">Access Denied</h2>
          <p className="text-[#41493e] mb-6">Please log in to view and manage your profile.</p>
          <a href="/login" className="bg-[#1b5e20] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#00450d] transition-colors">
            Login Now
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('phone', formData.phone);
      if (avatarFile) {
        dataToSend.append('avatar', avatarFile);
      }

      const { data } = await authApi.updateProfile(dataToSend);
      if (data.success) {
        updateUser(data.data);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setAvatarFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1b1c1c] mb-8">Account Settings</h1>
        
        <div className="bg-white rounded-3xl border border-[#c0c9bb] overflow-hidden shadow-ambient-1">
          {/* Header/Cover Section */}
          <div className="h-32 bg-gradient-to-r from-[#1b5e20] to-[#2e7d32]" />
          
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6 flex items-end justify-between">
              <div className="relative w-24 h-24 rounded-full border-4 border-white bg-[#eae8e7] overflow-hidden shadow-lg flex items-center justify-center group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[48px] text-[#717a6d]">person</span>
                )}
                
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  isEditing 
                  ? 'bg-[#f0eded] text-[#41493e] hover:bg-[#eae8e7]' 
                  : 'bg-[#1b5e20] text-white hover:bg-[#00450d] shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEditing ? 'close' : 'edit'}
                </span>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-[#f5f3f3] rounded-2xl border border-[#eae8e7]">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#717a6d] block mb-1">Full Name</label>
                    <p className="font-semibold text-[#1b1c1c]">{user?.name}</p>
                  </div>
                  <div className="p-4 bg-[#f5f3f3] rounded-2xl border border-[#eae8e7]">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#717a6d] block mb-1">Account Role</label>
                    <p className="font-semibold text-[#1b5e20] capitalize">{user?.role}</p>
                  </div>
                  <div className="p-4 bg-[#f5f3f3] rounded-2xl border border-[#eae8e7]">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#717a6d] block mb-1">Email Address</label>
                    <p className="font-semibold text-[#1b1c1c]">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-[#f5f3f3] rounded-2xl border border-[#eae8e7]">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#717a6d] block mb-1">Phone Number</label>
                    <p className="font-semibold text-[#1b1c1c]">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-[#f5f3f3]/50 p-6 rounded-2xl border border-[#c0c9bb] space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] bg-white transition-colors" 
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] bg-white transition-colors" 
                      placeholder="+201XXXXXXXXX"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#1b5e20] text-white py-4 rounded-xl font-bold hover:bg-[#00450d] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
