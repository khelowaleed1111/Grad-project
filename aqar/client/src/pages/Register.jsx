import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'owner', 'agent']),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ROLES = [
  { value: 'buyer', icon: 'search', label: 'Find a Property', desc: 'I am looking to buy or rent.' },
  { value: 'owner', icon: 'add_home', label: 'List My Property', desc: 'I am an owner looking to sell/rent.' },
  { value: 'agent', icon: 'domain', label: 'Manage Listings', desc: 'I am an agent or developer.' },
];

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'buyer' },
  });

  const selectedRole = watch('role');
  const pw = watch('password') || '';

  const pwStrength = pw.length === 0 ? 0 : pw.length < 8 ? 1 : pw.length < 12 ? 2 : 3;
  const strengthColor = ['', 'bg-[#ba1a1a]', 'bg-[#fcab28]', 'bg-[#1b5e20]'][pwStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][pwStrength];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = data;
      const user = await authRegister(rest);
      toast.success(`Welcome to Aqar, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (err) =>
    `block w-full px-4 py-3 bg-white border-2 rounded-lg text-[#1b1c1c] outline-none transition-colors
    ${err ? 'border-[#ba1a1a]' : 'border-[#c0c9bb] focus:border-[#1b5e20]'}`;

  return (
    <div className="min-h-screen flex bg-[#fbf9f8]">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[45%] fixed inset-y-0 left-0 flex-col justify-between p-10 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #1B5E20, #0A2E10)' }}
      >
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white mb-12">
            <span className="material-symbols-outlined text-[40px] text-[#91d78a]" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
            <span className="font-['Playfair_Display'] text-3xl font-bold">Aqar</span>
          </Link>
          <h2 className="font-['Playfair_Display'] text-3xl text-white leading-tight mb-6">
            Join Egypt's Leading Property Platform
          </h2>
          {[
            { icon: 'home', title: 'Verified Properties', desc: 'Access exclusive, vetted listings across the country.' },
            { icon: 'map', title: 'Smart Insights', desc: 'Data-driven market analysis to guide your decisions.' },
            { icon: 'lock', title: 'Secure Transactions', desc: 'Bank-level security for your peace of mind.' },
          ].map((b) => (
            <div key={b.icon} className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">{b.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">{b.title}</h4>
                <p className="text-sm text-white/70">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 border-l-4 border-[#fcab28] pl-4 mb-6">
          <p className="font-['Playfair_Display'] text-lg italic text-white/90">
            "Aqar made finding our dream villa seamless and secure. Highly recommended."
          </p>
          <p className="text-sm text-white/60 mt-2">— Sara M., Cairo</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex items-start justify-center px-6 py-16 min-h-screen">
        <div className="w-full max-w-md">
          {/* Top link */}
          <div className="flex justify-end mb-6">
            <p className="text-sm text-[#41493e]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00450d] font-medium hover:underline">Sign In</Link>
            </p>
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c] mb-1">Create Your Account</h2>
          <p className="text-sm text-[#41493e] mb-6">Select how you want to use Aqar to personalise your experience.</p>

          {/* Role selector */}
          <div className="flex flex-col gap-3 mb-6">
            {ROLES.map((r) => {
              const active = selectedRole === r.value;
              return (
                <label
                  key={r.value}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    active ? 'border-[#1b5e20] bg-[#e8f5e9]' : 'border-[#c0c9bb] bg-white hover:bg-[#f5f3f3]'
                  }`}
                  onClick={() => setValue('role', r.value)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                    active ? 'bg-[#1b5e20]/10 text-[#1b5e20]' : 'bg-[#e4e2e1] text-[#41493e]'
                  }`}>
                    <span className="material-symbols-outlined">{r.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span className="block font-semibold text-[#1b1c1c]">{r.label}</span>
                    <span className="block text-xs text-[#41493e]">{r.desc}</span>
                  </div>
                  {active && <span className="material-symbols-outlined text-[#1b5e20]">check_circle</span>}
                  <input type="radio" className="sr-only" {...register('role')} value={r.value} />
                </label>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input {...register('name')} type="text" placeholder="Full Name" className={inputClass(errors.name)} />
              {errors.name && <p className="text-[#ba1a1a] text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email')} type="email" placeholder="Email Address" className={inputClass(errors.email)} />
              {errors.email && <p className="text-[#ba1a1a] text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register('phone')} type="tel" placeholder="Phone Number (optional)" className={inputClass(errors.phone)} />
            </div>
            <div>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Password"
                  className={`${inputClass(errors.password)} pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#41493e]">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {pw.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-[#e4e2e1] rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex-1 h-full rounded-full transition-colors ${i <= pwStrength ? strengthColor : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#41493e]">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-[#ba1a1a] text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className={inputClass(errors.confirmPassword)} />
              {errors.confirmPassword && <p className="text-[#ba1a1a] text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#fcab28] text-[#694300] font-bold rounded-xl hover:bg-[#ffb957] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-[#694300]/30 border-t-[#694300] rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#41493e]">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#00450d] hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-[#00450d] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
