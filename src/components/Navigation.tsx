import { useState, memo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, Shield, Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useConfirm } from './ConfirmDialog';

// Define types for navigation items
interface NavItem {
  to: string;
  label: string;
  icon?: React.ComponentType<any>;
  condition?: boolean | null;
  className?: string;
  index?: number;
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { confirm } = useConfirm();
  const navRef = useRef<HTMLDivElement>(null);

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

  // Theme options with labels and colors
  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, color: 'bg-yellow-500' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-gray-800' },
    { id: 'blue-dark', label: 'Blue Dark', icon: null, color: 'bg-blue-500' },
    { id: 'gray', label: 'Gray', icon: null, color: 'bg-gray-500' },
    { id: 'yellow', label: 'Yellow', icon: null, color: 'bg-yellow-500' },
    { id: 'red-dark', label: 'Red Dark', icon: null, color: 'bg-red-500' },
    { id: 'green-dark', label: 'Green Dark', icon: null, color: 'bg-green-500' },
    { id: 'purple-dark', label: 'Purple Dark', icon: null, color: 'bg-purple-500' },
    { id: 'pink-dark', label: 'Pink Dark', icon: null, color: 'bg-pink-500' },
    { id: 'cyan-dark', label: 'Cyan Dark', icon: null, color: 'bg-cyan-500' },
    { id: 'system', label: 'System', icon: Monitor, color: 'bg-gray-400' }
  ];

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isThemeMenuOpen && !(event.target as Element).closest('.theme-toggle-container')) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  // Navigation items - reordered as per user request
  const navItems: NavItem[] = [
    { to: '/', label: 'Home' },
    { to: '/contact', label: 'Contact' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/search', label: 'Find Internships', condition: (!user || (user as { role: string }).role === 'student') },
    { to: '/company', label: 'For Companies' },
    { to: '/resources', label: 'Resources' },
    { to: '/success-stories', label: 'Success Stories' },
    { to: '/community', label: 'Community' },
    { to: '/post-internship', label: 'Post Internship', condition: user && (user as { role: string }).role === 'company', className: 'ml-2 px-4 py-2 rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors' }
  ];

  // Check which items fit in the navigation bar
  useEffect(() => {
    const checkOverflow = () => {
      if (!navRef.current) return;
      
      const navWidth = navRef.current.offsetWidth;
      let totalWidth = 0;
      const moreButtonWidth = 100; // Estimate for "More" button
      const visible: NavItem[] = [];
      const overflow: NavItem[] = [];
      
      // Calculate available width (subtracting space for logo and auth section)
      const availableWidth = navWidth - 300; // Approximate space for logo and auth section
      
      // Items that should always stay visible if they meet their conditions
      const priorityItems = ['Home', 'Contact', 'About', 'Services', 'Find Internships'];
      
      // First pass: Add priority items if they meet conditions
      const remainingItems: NavItem[] = [];
      navItems.forEach((item, index) => {
        // Skip items that don't meet condition
        if (item.condition !== undefined && !item.condition) return;
        
        const itemWithIndex = { ...item, index };
        
        // Check if this is a priority item
        if (priorityItems.includes(item.label)) {
          // Estimate width of each item
          const itemWidth = Math.max(item.label.length * 10 + 40, 80);
          
          // Add to visible if there's space
          if (totalWidth + itemWidth <= availableWidth - (overflow.length > 0 ? moreButtonWidth : 0)) {
            visible.push(itemWithIndex);
            totalWidth += itemWidth;
          } else {
            // Even priority items go to overflow if no space
            overflow.push(itemWithIndex);
          }
        } else {
          // Add to remaining items for second pass
          remainingItems.push(itemWithIndex);
        }
      });
      
      // Second pass: Add remaining items
      remainingItems.forEach((item) => {
        // Estimate width of each item
        const itemWidth = Math.max(item.label.length * 10 + 40, 80);
        
        if (totalWidth + itemWidth <= availableWidth - (overflow.length > 0 ? moreButtonWidth : 0)) {
          visible.push(item);
          totalWidth += itemWidth;
        } else {
          overflow.push(item);
        }
      });
      
      setVisibleItems(visible);
      setOverflowItems(overflow);
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [user]);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center ring-1 ring-primary/20">
                  <span className="font-bold">I</span>
                </div>
                <span className="text-xl font-black font-heading text-foreground">InternMatch</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Responsive flex wrap */}
          <div ref={navRef} className="hidden lg:flex flex-wrap items-center space-x-1 md:space-x-2 flex-1 justify-center">
            {visibleItems.map((item) => (
              <Link 
                key={item.index}
                to={item.to} 
                className={`px-2 py-2 md:px-3 rounded-md text-sm font-medium text-foreground hover:text-primary hover:underline decoration-primary underline-offset-4 transition-colors whitespace-nowrap ${
                  item.className || ''
                }`}
              >
                {item.icon && <item.icon size={16} className="inline mr-1" />}
                {item.label}
              </Link>
            ))}
            
            {overflowItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:underline decoration-primary underline-offset-4 transition-colors whitespace-nowrap flex items-center"
                >
                  More <ChevronDown size={16} className="ml-1" />
                </button>
                
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-popover ring-1 ring-border z-20">
                    <div className="py-1">
                      {overflowItems.map((item) => (
                        <Link
                          key={item.index}
                          to={item.to}
                          className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent transition-colors"
                          onClick={() => setIsMoreMenuOpen(false)}
                        >
                          {item.icon && <item.icon size={16} className="inline mr-2" />}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-foreground border border-border hover:border-primary transition-colors"
                  >
                    <div className="p-1 bg-accent rounded-lg">
                      {getUserIcon()}
                    </div>
                    <span className="hidden sm:block">{(user as {name: string}).name}</span>
                    <span className="hidden sm:block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                      {(user as {role: string}).role}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-lg shadow-lg bg-popover ring-1 ring-border z-20">
                      <div className="p-2">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="p-1 bg-accent rounded-md">
                            {getUserIcon()}
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors mt-1"
                        >
                          <div className="p-1 bg-destructive/10 rounded-md">
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
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-destructive border border-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:block">Logout</span>
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button - Show on small and medium screens */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Show when explicitly opened or on small/medium screens */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => {
              // Skip items that don't meet condition
              if (item.condition !== undefined && !item.condition) return null;
              
              return (
                <Link
                  key={index}
                  to={item.to}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon size={16} className="inline mr-1" />}
                  {item.label}
                </Link>
              );
            })}
            
            {!user && (
              <div className="pt-4 space-y-2 border-t border-border/50">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-4 space-y-2 border-t border-border/50">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{(user as {name: string}).name}</span>
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                    {(user as {role: string}).role}
                  </span>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Fixed Theme Toggle Button - Visible on all screen sizes */}
      <div className="theme-toggle-container fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
        <button
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          className="p-3 rounded-full text-foreground hover:bg-accent transition-colors bg-card border border-border shadow-lg hover:shadow-xl"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
        </button>

        {isThemeMenuOpen && (
          <div className="absolute bottom-16 right-0 w-64 rounded-lg shadow-xl bg-popover ring-1 ring-border z-50 max-h-96 overflow-y-auto">
            <div className="p-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Select Theme
              </div>
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTheme(option.id as any);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      theme === option.id 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {IconComponent ? (
                      <IconComponent size={18} />
                    ) : (
                      <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                    )}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default memo(Navigation);