import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, ShieldIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, error, clearError } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard
      if (user.role === 'student') navigate('/student-dashboard');
      else if (user.role === 'company') navigate('/company-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Clear previous errors
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      return;
    }
    
    if (!email.includes('@')) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    try {
      await login({ email, password, role });
      
      // Navigate based on user role after successful login
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'company') navigate('/company-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
      
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center space-x-6 max-w-4xl w-full">
          {/* Main Form */}
          <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-8 lg:p-10 border border-gray-100 flex-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-1 text-sm text-gray-600">Sign in to your account</p>
            </div>

            <div className="mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {role}
              </span>
            </div>

            {/* Demo Credentials Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1 text-sm">🎯 Demo Login</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Student:</strong> student@demo.com / password123</p>
                <p><strong>Company:</strong> company@demo.com / password123</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setRole('student')} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${role === 'student' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <UserIcon size={16} className={`${role === 'student' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className={`mt-1 text-xs font-medium ${role === 'student' ? 'text-emerald-700' : 'text-gray-700'}`}>
                      Student
                    </span>
                  </button>
                  <button type="button" onClick={() => setRole('company')} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${role === 'company' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <BriefcaseIcon size={16} className={`${role === 'company' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className={`mt-1 text-xs font-medium ${role === 'company' ? 'text-emerald-700' : 'text-gray-700'}`}>
                      Company
                    </span>
                  </button>
                  <button type="button" onClick={() => setRole('admin')} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${role === 'admin' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <ShieldIcon size={16} className={`${role === 'admin' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className={`mt-1 text-xs font-medium ${role === 'admin' ? 'text-emerald-700' : 'text-gray-700'}`}>
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" 
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 text-xs text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Side Image with Motivation */}
          <div className={`hidden md:flex flex-col items-center justify-center space-y-6 w-1/2 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0`}>
            <div className="relative">
              <img 
                src="/images/Daily 3D renders — abstract cloth edition.jpeg" 
                alt="Role motivation" 
                className="h-32 w-32 object-cover rounded-full shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {role === 'student' && '🎓'}
                {role === 'company' && '🏢'}
                {role === 'admin' && '🔒'}
              </div>
            </div>
            <div className="text-center max-w-64">
              <p className="text-lg font-bold text-gray-800">
                {role === 'student' && 'Build Your Future'}
                {role === 'company' && 'Find Top Talent'}
                {role === 'admin' && 'Manage Success'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {role === 'student' && 'Start your career journey with amazing internships'}
                {role === 'company' && 'Connect with talented students ready to contribute'}
                {role === 'admin' && 'Oversee the platform and ensure smooth operations'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;