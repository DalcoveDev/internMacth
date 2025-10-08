import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from './ConfirmDialog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();



  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout? You will need to sign in again to access your account.',
      confirmText: 'Logout',
      cancelText: 'Stay',
      type: 'warning'
    });
    
    if (confirmed) {
      logout();
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  const getUserIcon = () => {
    if (!user) return <User size={18} />;
    switch ((user as { role: string }).role) {
      case 'student':
        return <User size={18} />;
      case 'company':
        return <Briefcase size={18} />;
      case 'admin':
        return <Shield size={18} />;
      default:
        return <User size={18} />;
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch ((user as { role: string }).role) {
      case 'student':
        return '/student-dashboard';
      case 'company':
        return '/company-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center ring-1 ring-emerald-200">
                  <span className="font-bold">I</span>
                </div>
                <span className="text-xl font-black font-heading text-gray-900">InternMatch</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-700 hover:underline decoration-emerald-400 underline-offset-4 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-700 hover:underline decoration-emerald-400 underline-offset-4 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/services" 
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-700 hover:underline decoration-emerald-400 underline-offset-4 transition-colors"
            >
              Services
            </Link>
            {(!user || user.role === 'student') && (
              <Link 
                to="/search" 
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-700 hover:underline decoration-emerald-400 underline-offset-4 transition-colors"
              >
                Find Internships
              </Link>
            )}
            
            {user && (user as { role: string }).role === 'company' && (
              <Link 
                to="/post-internship" 
                className="ml-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Post Internship
              </Link>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-6">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up Now!
                  </Link>
                </>
              ) : (
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-800 border border-gray-300 hover:border-emerald-300 transition-colors"
                    >
                      <div className="p-1 bg-white/20 rounded-lg">
                        {getUserIcon()}
                      </div>
                      <span className="hidden sm:block">{(user as {name: string}).name}</span>
                    <span className="hidden sm:block text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                        {(user as {role: string}).role}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-60 rounded-lg shadow-lg bg-white ring-1 ring-gray-100 z-20">
                        <div className="p-2">
                          <Link
                            to={getDashboardLink()}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-gray-800 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="p-1 bg-gray-100 rounded-md">
                              {getUserIcon()}
                            </div>
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors mt-1"
                          >
                            <div className="p-1 bg-red-100 rounded-md">
                              <LogOut size={16} />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Dedicated Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <>
                {/* Mobile User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {getUserIcon()}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-100 z-20">
                      <div className="p-2">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-md transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {getUserIcon()}
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mobile Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50 border border-red-300 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            {(!user || user.role === 'student') && (
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Internships
              </Link>
            )}
            
            {user && (user as { role: string }).role === 'company' && (
              <Link
                to="/post-internship"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Post Internship
              </Link>
            )}

            {!user && (
              <div className="pt-4 space-y-2 border-t border-gray-200/50">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-4 space-y-2 border-t border-gray-200/50">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Signed in as <span className="font-medium text-gray-700">{(user as {name: string}).name}</span>
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                    {(user as {role: string}).role}
                  </span>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;