import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // For now, we simulate the API call as the backend doesn't have this yet
      console.log('Forgot password for:', data.email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      toast.success('If an account exists with that email, you will receive reset instructions.');
    } catch (err) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-ambient-3 border border-[#c0c9bb]/30 p-8">
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#717a6d] hover:text-[#1b5e20] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c] mb-2">Forgot Password?</h2>
            <p className="text-[#41493e] text-sm">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[#717a6d]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c0c9bb]" />
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-[#f5f3f3] border-2 rounded-xl text-[#1b1c1c] focus:outline-none transition-all ${
                      errors.email ? 'border-[#ba1a1a]' : 'border-transparent focus:border-[#1b5e20] focus:bg-white shadow-inner focus:shadow-none'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[#ba1a1a] text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1b5e20] text-white font-bold rounded-xl hover:bg-[#00450d] transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#1b5e20]" />
              </div>
              <h3 className="font-bold text-[#1b1c1c] text-lg mb-2">Check your email</h3>
              <p className="text-[#41493e] text-sm mb-6">
                We've sent a password reset link to the email provided.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#1b5e20] font-bold text-sm hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-center text-xs text-[#717a6d]">
          If you're still having trouble, please <Link to="/contact" className="text-[#1b5e20] hover:underline">contact our support team</Link>.
        </p>
      </div>
    </div>
  );
}
