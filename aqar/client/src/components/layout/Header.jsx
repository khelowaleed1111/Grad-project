import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';
import { Menu, X, Home, Building2, Info, Mail, User, LogOut, LayoutDashboard, Shield, Languages } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Properties', to: '/search', icon: Building2 },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Mail },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
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
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md border-b border-gray-200'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Building2 className="w-8 h-8 text-green-700 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-green-900">Aqar</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-green-700 border-b-2 border-green-700 pb-0.5'
                      : 'text-gray-700 hover:text-green-700'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            
            {isAuthenticated ? (
              <>
                {/* Show Admin link for admin users */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                
                {/* User Menu */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col py-3 px-4 space-y-1">
            {/* Navigation Links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <Languages className="w-4 h-4" />
              <span>Language: {language === 'en' ? 'English' : 'العربية'}</span>
            </button>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Auth Actions */}
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors text-center justify-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
