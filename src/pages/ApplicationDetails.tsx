import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, ShieldIcon, EyeIcon, EyeOffIcon, LogInIcon, UserPlusIcon, SearchIcon, TrendingUpIcon, BuildingIcon } from 'lucide-react';
import { Heading, Text } from '../components/Typography';
import { useAuth } from '../contexts/AuthContext';

const ApplicationDetails = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { user, login, signup, error, clearError } = useAuth();

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setLocalError('Please fill all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      await login({ email, password, role });
      setShowLoginForm(false);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setIsLoading(true);
    
    if (!name?.trim() || !email?.trim() || !password) {
      setLocalError('Please fill all required fields');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      await signup({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
      setShowSignupForm(false);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setLocalError('');
    setShowPassword(false);
    clearError();
  };

  const toggleLoginForm = () => {
    resetForms();
    setShowSignupForm(false);
    setShowLoginForm(!showLoginForm);
  };

  const toggleSignupForm = () => {
    resetForms();
    setShowLoginForm(false);
    setShowSignupForm(!showSignupForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heading level={1} className="text-white mb-6">
              InternMatch Applications
            </Heading>
            <Text size="xl" className="text-emerald-100 max-w-3xl mx-auto mb-8">
              Streamline your internship application process. Connect students with opportunities and companies with talent.
            </Text>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={toggleLoginForm}
                  className="inline-flex items-center px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <LogInIcon size={20} className="mr-2" />
                  Sign In
                </button>
                <button
                  onClick={toggleSignupForm}
                  className="inline-flex items-center px-8 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <UserPlusIcon size={20} className="mr-2" />
                  Create Account
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center px-6 py-3 bg-emerald-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    {user.role === 'student' && <UserIcon size={16} className="text-emerald-600" />}
                    {user.role === 'company' && <BriefcaseIcon size={16} className="text-emerald-600" />}
                    {user.role === 'admin' && <ShieldIcon size={16} className="text-emerald-600" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Welcome, {user.name}</p>
                    <p className="text-emerald-200 text-sm capitalize">{user.role} Account</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Login Form Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transition-all duration-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-center mb-8">
              <Heading level={3} className="mb-2">Welcome Back</Heading>
              <Text className="text-gray-600">Sign in to your account</Text>
            </div>
            
            {(error || localError) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{error || localError}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">I am a:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id: 'student', icon: UserIcon, label: 'Student'}, {id: 'company', icon: BriefcaseIcon, label: 'Company'}, {id: 'admin', icon: ShieldIcon, label: 'Admin'}].map(({id, icon: Icon, label}) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRole(id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                        role === id ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} className={role === id ? 'text-emerald-600' : 'text-gray-500'} />
                      <span className={`mt-1 text-xs font-medium ${role === id ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={toggleLoginForm}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowSignupForm(true);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transition-all duration-300 max-h-[90vh] overflow-y-auto ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-center mb-8">
              <Heading level={3} className="mb-2">Create Account</Heading>
              <Text className="text-gray-600">Join InternMatch today</Text>
            </div>
            
            {(error || localError) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{error || localError}</p>
              </div>
            )}
            
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">I am signing up as:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id: 'student', icon: UserIcon, label: 'Student'}, {id: 'company', icon: BriefcaseIcon, label: 'Company'}, {id: 'admin', icon: ShieldIcon, label: 'Admin'}].map(({id, icon: Icon, label}) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRole(id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                        role === id ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} className={role === id ? 'text-emerald-600' : 'text-gray-500'} />
                      <span className={`mt-1 text-xs font-medium ${role === id ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  {role === 'company' ? 'Company Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={role === 'company' ? 'Acme Corporation' : 'John Doe'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="signup-email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="signup-email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="signup-password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={toggleSignupForm}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignupForm(false);
                    setShowLoginForm(true);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">Streamlined Application Process</Heading>
            <Text size="lg" className="text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy for students to apply and companies to manage applications efficiently.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <SearchIcon size={32} />
              </div>
              <Heading level={4} className="mb-3">Discover Opportunities</Heading>
              <Text className="text-gray-600">
                Browse through hundreds of verified internship opportunities from top companies across various industries.
              </Text>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <UserIcon size={32} />
              </div>
              <Heading level={4} className="mb-3">One-Click Apply</Heading>
              <Text className="text-gray-600">
                Submit applications instantly with your saved profile, resume, and cover letter. Track progress in real-time.
              </Text>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <BuildingIcon size={32} />
              </div>
              <Heading level={4} className="mb-3">Company Dashboard</Heading>
              <Text className="text-gray-600">
                Manage applications, review candidates, and connect with talented students through our intuitive platform.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} className="text-white mb-4">
            Ready to Start Your Journey?
          </Heading>
          <Text size="xl" className="text-emerald-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students and companies who have found success through our platform.
          </Text>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <SearchIcon size={20} className="mr-2" />
              Browse Internships
            </Link>
            <Link
              to="/post-internship"
              className="inline-flex items-center px-8 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <TrendingUpIcon size={20} className="mr-2" />
              Post an Internship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationDetails;