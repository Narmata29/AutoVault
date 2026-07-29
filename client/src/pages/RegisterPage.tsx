import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CarFront, AlertCircle, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: any = { name, email, password };
      if (adminSecret.trim()) {
        payload.adminSecret = adminSecret;
      }
      
      const response = await api.post('/auth/register', payload);
      login(response.data.user, response.data.token);
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.data.details) {
          setError(err.response.data.details.map((d: any) => d.message).join(', '));
        } else {
          setError(err.response.data.error || 'Registration failed.');
        }
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
          src="https://images.unsplash.com/photo-1503376712394-6fc92ce556c8?auto=format&fit=crop&q=80&w=2070" 
          alt="Sports Car" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white animate-slide-up">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Start Your Journey.</h2>
          <p className="text-lg text-slate-300 max-w-md font-light leading-relaxed">
            Join the elite circle of AutoVault members and gain exclusive access to the world's most sought-after vehicles.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md w-full space-y-6 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white animate-fade-in relative overflow-hidden">
          {/* Decorative blur circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          
          <div className="text-center relative z-10">
            <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <CarFront className="h-7 w-7 text-white transform -rotate-3" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Join AutoVault to start managing inventory
            </p>
          </div>
          
          <form className="mt-6 space-y-5 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start shadow-sm">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-primary-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field py-2"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-slate-700 mb-1">
                  Email address <span className="text-primary-500">*</span>
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field py-2"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                    Password <span className="text-primary-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input-field py-2"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-primary-500">*</span>
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="input-field py-2"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <label htmlFor="admin-secret" className="block text-sm font-semibold text-slate-700 mb-1">
                  Admin Secret Key <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  id="admin-secret"
                  name="admin-secret"
                  type="password"
                  className="input-field py-2 border-dashed bg-slate-50/50"
                  placeholder="Leave blank for regular user"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Creating account...
                  </>
                ) : (
                  'Sign up securely'
                )}
              </button>
            </div>
            
            <div className="text-center text-sm font-medium pt-2">
              <span className="text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
