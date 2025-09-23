import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, ShieldIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Mock registration - in a real app, this would be an API call
    // For demo purposes, we'll just set the user in localStorage
    // Simulate successful registration
    const user = {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
      role
    };
    localStorage.setItem('user', JSON.stringify(user));
    // Redirect based on role
    switch (role) {
      case 'student':
        navigate('/student-dashboard');
        break;
      case 'company':
        navigate('/company-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/');
    }
  };
  return <div className="max-w-md mx-auto my-12 px-4 sm:px-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join InternMatch today</p>
        </div>
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>}
        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              I am signing up as:
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button type="button" onClick={() => setRole('student')} className={`flex flex-col items-center justify-center p-4 rounded-lg border ${role === 'student' ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}>
                <UserIcon size={24} className={role === 'student' ? 'text-blue-500' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'student' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Student
                </span>
              </button>
              <button type="button" onClick={() => setRole('company')} className={`flex flex-col items-center justify-center p-4 rounded-lg border ${role === 'company' ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}>
                <BriefcaseIcon size={24} className={role === 'company' ? 'text-blue-500' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'company' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Company
                </span>
              </button>
              <button type="button" onClick={() => setRole('admin')} className={`flex flex-col items-center justify-center p-4 rounded-lg border ${role === 'admin' ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}>
                <ShieldIcon size={24} className={role === 'admin' ? 'text-blue-500' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'admin' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Admin
                </span>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
              {role === 'company' ? 'Company Name' : 'Full Name'}
            </label>
            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder={role === 'company' ? 'Acme Corporation' : 'John Doe'} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input type={showPassword ? 'text' : 'password'} id="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <input id="terms" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" required />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Signup;