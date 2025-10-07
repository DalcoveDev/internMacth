import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api';
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
    // Create user via API only
    createUser({ name, email, password, role }).then((created: any) => {
      const user = { id: created.id, name: created.name, email: created.email, role: created.role };
      localStorage.setItem('user', JSON.stringify(user));
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'company') navigate('/company-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    }).catch((err) => {
      setError('Signup failed. Please try again.');
      console.error(err)
    })
  };
  const [mounted, setMounted] = useState(false);
  const roleImageMap: Record<string, string> = {
    student: '/src/images/Internships.jpeg',
    company: '/src/images/Internship.jpeg',
    admin: '/src/images/Internship.jpeg'
  };
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);
  return <div className="max-w-5xl mx-auto my-12 px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        <div className={`bg-white shadow md:shadow-md rounded-lg p-8 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join InternMatch today</p>
        </div>
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Selected role: {role}
          </span>
        </div>
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>}
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              I am signing up as:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setRole('student')} className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${role === 'student' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200'}`}>
                <UserIcon size={24} className={role === 'student' ? 'text-emerald-600' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'student' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Student
                </span>
              </button>
              <button type="button" onClick={() => setRole('company')} className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${role === 'company' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200'}`}>
                <BriefcaseIcon size={24} className={role === 'company' ? 'text-emerald-600' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'company' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Company
                </span>
              </button>
              <button type="button" onClick={() => setRole('admin')} className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${role === 'admin' ? 'bg-emerald-50 border-emerald-500' : 'border-gray-200'}`}>
                <ShieldIcon size={24} className={role === 'admin' ? 'text-emerald-600' : 'text-gray-500'} />
                <span className={`mt-2 text-sm ${role === 'admin' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Admin
                </span>
              </button>
            </div>
          </div>
          <div className="grid gap-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
              {role === 'company' ? 'Company Name' : 'Full Name'}
            </label>
            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder={role === 'company' ? 'Acme Corporation' : 'John Doe'} value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input type={showPassword ? 'text' : 'password'} id="confirmPassword" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <input id="terms" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" required />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-transform duration-200 will-change-transform hover:-translate-y-0.5">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
        </div>
        <div className={`hidden md:block relative rounded-lg overflow-hidden shadow-md transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 min-h-[420px] md:min-h-[560px]`}>
          <div className="absolute inset-0 bg-emerald-700/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/0 to-white/20 pointer-events-none"></div>
          <img
            key={role}
            src={roleImageMap[role]}
            alt="role visual"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out opacity-100"
          />
        </div>
      </div>
    </div>;
};
export default Signup;