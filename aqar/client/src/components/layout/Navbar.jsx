import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const NAV_LINKS = [
  { label: 'Properties', labelAr: 'العقارات', to: '/search' },
  { label: 'About', labelAr: 'عن أقار', to: '/about' },
  { label: 'Contact', labelAr: 'تواصل معنا', to: '/contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fbf9f8] shadow-ambient-2 border-b border-[#c0c9bb]'
          : 'bg-[#fbf9f8]/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span
            className="material-symbols-outlined filled text-[32px] text-[#1b5e20] group-hover:scale-110 transition-transform"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            real_estate_agent
          </span>
          <span className="font-['Playfair_Display'] text-2xl font-bold text-[#00450d]">
            Aqar
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[#00450d] border-b-2 border-[#00450d] pb-0.5'
                    : 'text-[#41493e] hover:text-[#00450d]'
                }`
              }
            >
              {lang === 'ar' ? link.labelAr : link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop trailing actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-[#41493e] hover:text-[#00450d] transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            {lang === 'en' ? 'EN/AR' : 'AR/EN'}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-1.5 text-sm font-medium text-[#41493e] hover:text-[#00450d] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold uppercase tracking-widest text-[#00450d] border border-[#00450d] px-4 py-2 rounded-full hover:bg-[#00450d] hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-widest text-[#00450d] border border-[#00450d] px-4 py-2 rounded-full hover:bg-[#00450d]/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard/listings/new"
                className="text-xs font-bold uppercase tracking-widest bg-[#1b5e20] text-[#90d689] px-6 py-2 rounded-full hover:bg-[#00450d] transition-colors hover:-translate-y-0.5 transform shadow-sm"
              >
                List Property
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#1b1c1c] p-2 rounded-lg hover:bg-[#f0eded] transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#fbf9f8] border-t border-[#c0c9bb] shadow-ambient-2">
          <div className="flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-3 text-sm font-medium text-[#41493e] hover:text-[#00450d] hover:bg-[#f0eded] transition-colors"
              >
                {lang === 'ar' ? link.labelAr : link.label}
              </Link>
            ))}
            <div className="border-t border-[#c0c9bb] mt-2 pt-2 px-6 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-sm font-medium text-[#41493e]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-sm font-medium text-red-600 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-sm font-medium text-[#00450d]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-sm font-medium text-[#00450d]"
                  >
                    Register
                  </Link>
                </>
              )}
              <button
                onClick={toggleLang}
                className="py-2 text-xs font-bold uppercase tracking-widest text-[#41493e] text-left"
              >
                Switch to {lang === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
