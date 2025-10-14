import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, UserIcon, BuildingIcon, TrendingUpIcon } from 'lucide-react';
import Hero from '../components/Hero';
import InternshipCard from '../components/InternshipCard';
import { Internship } from '../components/InternshipCard';
import { homeAPI } from '../lib/new-api-client';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const [content, setContent] = useState({
    featuredInternships: [] as Internship[],
    stats: {
      companies: 0,
      jobs: 0,
      placements: 0
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await homeAPI.getContent();
        setContent(response.data.data);
      } catch (error: any) {
        console.error('Failed to fetch home content:', error);
        toast({
          title: "Error",
          description: "Failed to load home content. Using default content.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    
    // Preload background images
    const images = [
      '/images/Download Abstract green papercut style layers background for free.jpeg',
      '/images/download.jpeg',
      '/images/Daily 3D renders — abstract cloth edition.jpeg'
    ];

    let loadedCount = 0;
    const totalImages = images.length;

    const updateLoadedState = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        // Image loading complete - no state to update
      }
    };

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = updateLoadedState;
      img.onerror = updateLoadedState;
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background text-foreground">
      <Hero />
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted relative overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 parallax-bg"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
        ></div>
        {/* Additional decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 rounded-lg bg-primary/20 backdrop-blur-sm -rotate-12"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Quick and simple steps to connect students with the best opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center border border-border relative overflow-hidden hover:border-primary">
              {/* Decorative element for each card */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 transition-colors duration-300">
                <SearchIcon size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Explore Internships</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore hundreds of internships available on our platform and easily
                narrow your search by location, industry, and duration. Whether you're
                looking for part-time, full-time, or remote opportunities, 
                our filters help you find internships that 
                match your skills and career goals, making the process simple and efficient.
              </p>
            </div>
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center border border-border relative overflow-hidden hover:border-primary">
              {/* Decorative element for each card */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 transition-colors duration-300">
                <UserIcon size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Apply with One Click</h3>
              <p className="text-muted-foreground leading-relaxed">
                Apply for internships directly through our platform with ease. 
                Complete your profile, upload your resume and supporting documents,
                and submit your application in just a few clicks. Track your applications,
                receive updates from companies,
                and take the next step in building your career—all in one convenient place.
              </p>
            </div>
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center border border-border relative overflow-hidden hover:border-primary">
              {/* Decorative element for each card */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 transition-colors duration-300">
                <BuildingIcon size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">For Organizations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Take control of your career and apply for internships directly on our platform.
                Fill out your profile, upload your resume and documents, 
                and submit applications in just a few clicks. Stay organized, 
                track your progress, connect with top companies,
                and explore exciting opportunities that match your skills and ambitions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Links Section - Enhanced */}
      <section className="py-16 bg-gradient-to-br from-background to-muted relative overflow-hidden">
        {/* Background Image with Floating Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 floating-bg"
          style={{ backgroundImage: `url('/images/download.jpeg')` }}
        ></div>
        {/* Additional decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/30 backdrop-blur-sm"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-lg bg-primary/30 backdrop-blur-sm rotate-45"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Learn More About InternMatch</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover how we're revolutionizing the internship experience
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/about" className="group px-8 py-4 bg-card text-primary font-bold rounded-2xl hover:bg-accent border-2 border-border text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              About Us
            </Link>
            <Link to="/services" className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Our Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Internships Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-background to-muted relative overflow-hidden">
        {/* Background Image with Floating Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 floating-bg"
          style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
        ></div>
        {/* Additional decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-5 left-5 w-20 h-20 rounded-lg bg-primary/20 backdrop-blur-sm rotate-12"></div>
          <div className="absolute bottom-5 right-5 w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Featured Internships
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover top opportunities from leading companies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.featuredInternships.map(internship => <InternshipCard key={internship.id} internship={internship} />)}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/search" className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
              View All Internships
              <TrendingUpIcon size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden">
        {/* Background Image with enhanced effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url('/images/new.jpeg')` }}
        ></div>
        {/* Additional decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Internship
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who found their ideal internship match
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/search" className="px-8 py-3 bg-card text-foreground font-bold rounded-xl hover:bg-accent transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300">
              Browse Internships
            </Link>
            <Link to="/post-internship" className="px-8 py-3 bg-primary/80 text-primary-foreground font-bold rounded-xl hover:bg-primary transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300">
              Post an Internship
            </Link>
          </div>
        </div>
      </section>
    </div>;
};

export default Home;