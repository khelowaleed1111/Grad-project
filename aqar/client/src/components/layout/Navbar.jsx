import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Properties', to: '/search' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop trailing actions */}
        <div className="hidden md:flex items-center gap-3">

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-1.5 text-sm font-medium text-[#41493e] hover:text-[#00450d] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button to="/login" variant="text" size="sm">
                Sign In
              </Button>
              <Button to="/dashboard/listings/new" size="sm" icon="add_business">
                List Property
              </Button>
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
        <div className="md:hidden bg-[#fbf9f8] border-t border-[#c0c9bb] shadow-ambient-2 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1b5e20]/10 text-[#00450d]'
                        : 'text-[#41493e] hover:bg-[#f0eded]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button to={getDashboardLink()} onClick={() => setMenuOpen(false)} variant="outline" fullWidth icon="dashboard">
                    {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Button>
                  <Button onClick={handleLogout} variant="text" fullWidth className="text-red-600">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/login" onClick={() => setMenuOpen(false)} variant="outline" fullWidth>
                    Sign In
                  </Button>
                  <Button to="/register" onClick={() => setMenuOpen(false)} fullWidth>
                    Get Started
                  </Button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
