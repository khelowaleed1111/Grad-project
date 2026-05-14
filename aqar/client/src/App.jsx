import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PrivateRoute, RoleRoute } from './routes/ProtectedRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AddProperty from './pages/Dashboard/AddProperty';
import EditProperty from './pages/Dashboard/EditProperty';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PendingApprovals from './pages/Admin/PendingApprovals';
import UserManagement from './pages/Admin/UserManagement';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* All routes wrapped in Layout */}
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/search" element={<Search />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected: any authenticated user */}
              <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute><UserDashboard /></PrivateRoute>
              } />
              <Route path="/dashboard/listings/new" element={
                <PrivateRoute><AddProperty /></PrivateRoute>
              } />
              <Route path="/dashboard/listings/edit/:id" element={
                <PrivateRoute><EditProperty /></PrivateRoute>
              } />

              {/* Protected: admin only */}
              <Route path="/admin" element={
                <RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>
              } />
              <Route path="/admin/pending" element={
                <RoleRoute roles={['admin']}><PendingApprovals /></RoleRoute>
              } />
              <Route path="/admin/users" element={
                <RoleRoute roles={['admin']}><UserManagement /></RoleRoute>
              } />

              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a 
                      href="/" 
                      className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Route>
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
