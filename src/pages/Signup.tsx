import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '../contexts/ThemeContext'; // Add this import
import { EyeIcon, EyeOffIcon, UserIcon, BuildingIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Signup = () => {
  const { effectiveTheme } = useTheme(); // Get the current theme
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // For visual progress feedback
  const navigate = useNavigate();
  const { user, signup, error, clearError } = useAuth();
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Clear previous errors
    setLocalError(''); // Clear local errors
    setIsLoading(true);
    setProgress(0);
    
    // Enhanced validation
    if (!name?.trim() || !email?.trim() || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (name.trim().length < 2) {
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Check password strength
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      toast({
        title: "Weak Password",
        description: "Password must contain both letters and numbers",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      await signup({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Account Created",
        description: "Your account has been successfully created!",
      });
      
      // Navigate based on role after successful signup
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'company') navigate('/company-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    // Use theme-aware background classes
    <div className={`min-h-screen relative overflow-hidden ${effectiveTheme === 'dark' ? 'bg-background' : 'bg-gradient-to-br from-emerald-50 to-green-100'}`}>
      {/* Background Image with theme-aware opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-start space-x-6 max-w-6xl w-full">
          {/* Benefits Panel */}
          {(role === 'student' || role === 'company') && (
            <Card className={`w-80 hidden lg:block backdrop-blur-sm ${effectiveTheme === 'dark' ? 'bg-background/30 border border-border' : 'bg-white/30 border border-white/50'} relative overflow-hidden`}>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
              ></div>
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {role === 'student' ? <UserIcon className="h-5 w-5" /> : <BuildingIcon className="h-5 w-5" />}
                    {role === 'student' ? 'Student Benefits' : 'Company Benefits'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {role === 'student' ? (
                      <>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Access to thousands of internships from top companies</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Personalized internship recommendations based on your interests</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Build your professional portfolio with real projects</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Connect with industry mentors and professionals</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Track your applications and receive feedback</p>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Post internships and find talented students quickly</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Access to a pool of pre-vetted candidates</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Streamline your hiring process with our tools</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Build your employer brand with student community</p>
                        </li>
                        <li className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-emerald-600'} mt-0.5`}>•</div>
                          <p className={`ml-2 text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>Manage all internship postings in one dashboard</p>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Main Form */}
          <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 backdrop-blur-sm ${effectiveTheme === 'dark' ? 'bg-background/30 border border-border' : 'bg-white/30 border border-white/50'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create Account</CardTitle>
              <CardDescription>Join InternMatch today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${effectiveTheme === 'dark' ? 'bg-muted text-foreground border border-border' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {role}
                </span>
              </div>

              {(error || localError) && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error || localError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignup} className="space-y-3">
                <div className="mb-3">
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
                  <Label htmlFor="name" className="block text-sm font-medium mb-1">
                    {role === 'company' ? 'Company Name' : 'Full Name'}
                  </Label>
                  <Input 
                    type="text" 
                    id="name" 
                    placeholder={role === 'company' ? 'Acme Corp' : 'John Doe'} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className={effectiveTheme === 'dark' ? 'bg-background border border-border text-foreground' : ''}
                  />
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
                  <p className={`mt-1 text-xs ${effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>At least 8 characters with letters and numbers</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </Label>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    className={effectiveTheme === 'dark' ? 'bg-background border border-border text-foreground' : ''}
                  />
                </div>

                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className={`text-sm ${effectiveTheme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>
                      I agree to the{' '}
                      <a href="#" className={effectiveTheme === 'dark' ? 'text-primary hover:text-primary/90' : 'text-emerald-600 hover:text-emerald-700'}>
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#" className={effectiveTheme === 'dark' ? 'text-primary hover:text-primary/90' : 'text-emerald-600 hover:text-emerald-700'}>
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </div>

                {/* Progress bar for signup process */}
                {isLoading && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>Creating your account...</span>
                      <span className={effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>{progress}%</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${effectiveTheme === 'dark' ? 'bg-muted' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ease-out ${effectiveTheme === 'dark' ? 'bg-primary' : 'bg-emerald-600'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className={`mt-2 text-xs ${effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                      Securing your account with encryption...
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-3 text-center">
                <p className={`text-sm ${effectiveTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link to="/login" className={effectiveTheme === 'dark' ? 'text-primary hover:text-primary/90 font-medium' : 'text-emerald-600 hover:text-emerald-700 font-medium'}>
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Signup;