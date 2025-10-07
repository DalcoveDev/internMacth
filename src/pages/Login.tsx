import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, ShieldIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { login } from '../api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    // Call backend login
    login({ email, password }).then((resp: any) => {
      const user = resp.user || { id: 0, name: email.split('@')[0], email, role };
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'student') navigate('/student-dashboard');
      else if (user.role === 'company') navigate('/company-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    }).catch(() => {
      setError('Invalid credentials');
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
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
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              I am a:
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
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-emerald-600 hover:text-emerald-700">
                Forgot your password?
              </a>
            </div>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-transform duration-200 will-change-transform hover:-translate-y-0.5">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign up
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
export default Login;