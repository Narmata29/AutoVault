import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// A small wrapper to redirect logged-in users away from auth pages
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  
  return <>{children}</>;
};

// Redirect admins away from the public user dashboard
const AdminRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } />
            <Route path="/register" element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            } />

            {/* Protected Application Routes */}
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={
                  <AdminRedirect>
                    <DashboardPage />
                  </AdminRedirect>
                } />
              </Route>
              
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
