import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CarFront, AlertCircle, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.error || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2070" 
          alt="Luxury Interior" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white animate-slide-up">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Drive Your Dream.</h2>
          <p className="text-lg text-slate-300 max-w-md font-light leading-relaxed">
            Experience the pinnacle of automotive engineering with AutoVault's curated collection of premium vehicles.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white animate-fade-in relative overflow-hidden">
          {/* Decorative blur circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          
          <div className="text-center relative z-10">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <CarFront className="h-8 w-8 text-white transform -rotate-3" />
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Sign in to access your AutoVault account
            </p>
          </div>
          
          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start animate-fade-in shadow-sm">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Authenticating...
                  </>
                ) : (
                  'Sign in securely'
                )}
              </button>
            </div>
            
            <div className="text-center text-sm font-medium">
              <span className="text-slate-500">Don't have an account? </span>
              <Link to="/register" className="text-primary-600 hover:text-primary-700 transition-colors">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
