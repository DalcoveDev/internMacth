import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { homeAPI } from '../lib/new-api-client';
import { toast } from '@/hooks/use-toast';

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stats, setStats] = useState({
    companies: 1000,
    jobs: 10000,
    placements: 5000
  });
  
  // Preload image to improve perceived performance
  useEffect(() => {
    const img = new Image();
    img.src = "/images/career.jpeg";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await homeAPI.getContent();
        setStats(response.data.data.stats);
      } catch (error: any) {
        console.error('Failed to fetch home stats:', error);
        toast({
          title: "Error",
          description: "Failed to load statistics. Using default values.",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-br from-background via-primary/5 to-secondary/5 text-foreground min-h-[80vh] flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 rounded-lg bg-primary/20 backdrop-blur-sm rotate-45"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm">
              <Search size={16} className="mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Empowering Career Growth</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-foreground leading-tight">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Perfect</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Internship</span> for You
            </h1>
            
            <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-xl">
              Discover amazing opportunities with top companies and kickstart your dream career. Your journey to success starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary Search Button */}
              <Link
                to="/search"
                className="group flex items-center justify-center px-6 py-3 bg-primary
                text-base font-semibold font-accent rounded-lg text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
              >
                <Search size={18} className="mr-2" />
                Find Internships
              </Link>
              
              {/* Secondary Button */}
              <Link
                to="/post-internship"
                className="group flex items-center justify-center px-6 py-3 bg-card
                text-base font-semibold font-accent rounded-lg text-foreground border border-border
                hover:border-primary hover:text-primary transition-colors"
              >
                <Briefcase size={18} className="mr-2" />
                Post Internship
              </Link>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="relative flex justify-center items-center">
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl rotate-12 opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-lg -rotate-12 opacity-40"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-card/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-md mx-auto">
              {!imageLoaded && (
                <div className="rounded-l w-full h-84 sm:h-80 bg-gray-200 animate-pulse dark:bg-gray-700" />
              )}
              {imageLoaded && (
                <img
                  src="/images/career.jpeg"
                  alt="Career development"
                  className="rounded-l w-full object-cover h-84 sm:h-80 shadow-lg"
                />
              )}
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-3 -right-3 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-border">
                <div className="text-lg font-bold text-primary">{stats.companies}+</div>
                <div className="text-xs text-muted-foreground">Companies</div>
              </div>
              
              <div className="absolute -bottom-3 -left-3 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-border">
                <div className="text-lg font-bold text-primary">{stats.jobs}+</div>
                <div className="text-xs text-muted-foreground">Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;