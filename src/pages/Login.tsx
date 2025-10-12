import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '../contexts/ThemeContext'; // Add this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const { effectiveTheme } = useTheme(); // Get the current theme
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, error, clearError } = useAuth();
  const { toast } = useToast();
  
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
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await login({ email, password, role });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${email.split('@')[0]}!`,
      });
      
      // Navigate based on user role after successful login
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'company') navigate('/company-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
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
    // Use theme-aware background classes
    <div className={`min-h-screen relative overflow-hidden ${effectiveTheme === 'dark' ? 'bg-background' : 'bg-gradient-to-br from-emerald-50 to-green-100'}`}>
      {/* Background Image with theme-aware opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center space-x-6 max-w-4xl w-full">
          {/* Main Form */}
          <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 backdrop-blur-sm ${effectiveTheme === 'dark' ? 'bg-background/30 border border-border' : 'bg-white/30 border border-white/50'} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${effectiveTheme === 'dark' ? 'bg-muted text-foreground border border-border' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {role}
                </span>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="mb-4">
                  <Label className="block text-sm font-medium mb-2" htmlFor="role">
                    Role:
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 ${effectiveTheme === 'dark' ? 'bg-background border border-border text-foreground focus:ring-primary focus:border-primary' : 'border border-gray-300 text-gray-700 focus:ring-emerald-500 focus:border-emerald-500'}`}
                  >
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className={effectiveTheme === 'dark' ? 'bg-background border border-border text-foreground' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      id="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      className={effectiveTheme === 'dark' ? 'bg-background border border-border text-foreground' : ''}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon className="h-4 w-4 text-muted-foreground" /> : <EyeIcon className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className={`text-sm ${effectiveTheme === 'dark' ? 'text-primary hover:text-primary/90' : 'text-emerald-600 hover:text-emerald-700'}`}>
                    Forgot password?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className={`text-sm ${effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <Link to="/signup" className={effectiveTheme === 'dark' ? 'text-primary hover:text-primary/90 font-medium' : 'text-emerald-600 hover:text-emerald-700 font-medium'}>
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Side Image with Motivation */}

        </div>
      </div>
    </div>
  );
};

export default Login;