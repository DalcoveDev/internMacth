import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, Shield } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
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
    <nav className="bg-white shadow-xl border-b-2 border-gradient-to-r from-cyan-400 to-blue-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                  <span className="text-white font-black text-lg">I</span>
                </div>
                <div>
                  <span className="text-2xl font-black font-heading bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-700 bg-clip-text text-transparent">
                    InternMatch
                  </span>
                  <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className="px-6 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="px-6 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Find Internships
            </Link>
            
            {user && (user as { role: string }).role === 'company' && (
              <Link 
                to="/post-internship" 
                className="px-6 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Post Internship
              </Link>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-8">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className="px-6 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-400 transform hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-8 py-3 rounded-xl text-base font-black text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-pulse"
                  >
                    Sign Up Now!
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-5 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900 border-2 border-gray-600 hover:border-cyan-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="p-1 bg-white/20 rounded-lg">
                      {getUserIcon()}
                    </div>
                    <span className="hidden sm:block">{(user as {name: string}).name}</span>
                    <span className="hidden sm:block text-xs bg-cyan-400 text-gray-900 px-3 py-1 rounded-full font-black uppercase tracking-wide">
                      {(user as {role: string}).role}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white ring-2 ring-cyan-200 z-20 border-t-4 border-gradient-to-r from-cyan-400 to-blue-500">
                      <div className="p-4">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-base font-bold text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 rounded-xl transform hover:scale-105 transition-all duration-300"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="p-1 bg-gray-200 rounded-lg">
                            {getUserIcon()}
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-base font-bold text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transform hover:scale-105 transition-all duration-300 mt-2"
                        >
                          <div className="p-1 bg-red-100 rounded-lg">
                            <LogOut size={16} />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100/80 transition-all duration-200"
                >
                  {getUserIcon()}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white/95 backdrop-blur-md ring-1 ring-gray-200/50 z-20">
                    <div className="p-2">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {getUserIcon()}
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-blue-50/50 transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50/50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50/50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Internships
            </Link>
            
            {user && (user as { role: string }).role === 'company' && (
              <Link
                to="/post-internship"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50/50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Post Internship
              </Link>
            )}

            {!user && (
              <div className="pt-4 space-y-2 border-t border-gray-200/50">
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;