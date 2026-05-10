import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fbf9f8]">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-[45%] fixed inset-y-0 left-0 flex-col justify-between p-10 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #1B5E20, #0A2E10)' }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        {/* Floating stat pills */}
        <div className="absolute top-1/4 left-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#91d78a] text-[20px]">apartment</span>
          <span className="font-medium text-white">10K+ Properties</span>
        </div>
        <div className="absolute top-1/2 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb957] text-[20px]">verified_user</span>
          <span className="font-medium text-white">Trusted by 50K+</span>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white mb-16">
            <span className="material-symbols-outlined text-[40px] text-[#91d78a]" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold">Aqar</span>
          </Link>
          <h2 className="font-['Playfair_Display'] text-4xl text-white leading-tight mb-4">
            Welcome Back to Aqar
          </h2>
          <p className="text-[#91d78a] text-base leading-relaxed max-w-sm">
            Your next property is just a search away. Sign in to access your saved listings, personalized recommendations, and expert market insights.
          </p>
        </div>

        <div className="relative z-10 border-l-4 border-[#fcab28] pl-4 mb-6">
          <p className="font-['Playfair_Display'] text-xl italic text-white/90">
            "Aqar made finding our dream villa in New Cairo seamless and secure."
          </p>
          <p className="text-sm text-white/60 mt-2">— Sara M., Cairo</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex items-center justify-center px-6 py-16 min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-ambient-2 border border-[#e4e2e1] p-8 flex flex-col gap-6">
            {/* Header */}
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c] mb-1">Sign In</h2>
              <p className="text-sm text-[#41493e]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#00450d] font-medium hover:underline">Register Free →</Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Email */}
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder=" "
                  className={`peer w-full h-14 px-4 pt-4 pb-1 rounded-lg border bg-white text-[#1b1c1c] outline-none transition-colors
                    ${errors.email ? 'border-[#ba1a1a] focus:border-[#ba1a1a]' : 'border-[#c0c9bb] focus:border-[#1b5e20]'}`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717a6d] text-sm transition-all pointer-events-none
                    peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#1b5e20]
                    peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Email Address
                </label>
                {errors.email && <p className="text-[#ba1a1a] text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  placeholder=" "
                  className={`peer w-full h-14 px-4 pt-4 pb-1 pr-12 rounded-lg border bg-white text-[#1b1c1c] outline-none transition-colors
                    ${errors.password ? 'border-[#ba1a1a]' : 'border-[#c0c9bb] focus:border-[#1b5e20]'}`}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717a6d] text-sm transition-all pointer-events-none
                    peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#1b5e20]
                    peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Password
                </label>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#41493e] hover:text-[#00450d]">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
                {errors.password && <p className="text-[#ba1a1a] text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Remember & forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#c0c9bb] text-[#1b5e20] focus:ring-[#1b5e20]" />
                  <span className="text-sm text-[#41493e]">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#fcab28] hover:text-[#ffb957] font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#1b5e20] text-white rounded-lg font-semibold text-base hover:bg-[#00450d] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-[#e4e2e1] flex-1" />
              <span className="text-xs text-[#41493e] uppercase tracking-wider">or</span>
              <div className="h-px bg-[#e4e2e1] flex-1" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full h-14 rounded-lg border border-[#c0c9bb] bg-white text-[#1b1c1c] font-semibold hover:bg-[#f5f3f3] transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
