import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Pages that don't show the Header (auth pages)
const NO_HEADER_PATHS = ['/login', '/register', '/forgot-password'];

// Pages that don't show the Footer
const NO_FOOTER_PATHS = ['/login', '/register', '/forgot-password', '/search'];

export default function Layout() {
  const location = useLocation();
  
  const hideHeader = NO_HEADER_PATHS.includes(location.pathname);
  const hideFooter = NO_FOOTER_PATHS.includes(location.pathname) || 
    location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {!hideHeader && <Header />}

      {/* Main Content Area */}
      <main className={`flex-1 ${!hideHeader ? 'pt-16' : ''}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}
