import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-gray-800 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-cyan-200/50 shadow-sm">
              <Search size={16} className="mr-2 text-cyan-500" />
              <span className="text-sm font-medium text-gray-600">Empowering Career Growth</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-gray-800 leading-tight">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Perfect</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Internship</span> for You
            </h1>
            
            <p className="text-lg font-body text-gray-500 leading-relaxed max-w-xl">
              Discover amazing opportunities with top companies and kickstart your dream career. Your journey to success starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary Search Button */}
              <Link
                to="/search"
                className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500
                text-base font-semibold font-accent rounded-lg text-white shadow-lg hover:shadow-xl 
                transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <Search size={18} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Find Internships
              </Link>
              
              {/* Secondary Button */}
              <Link
                to="/post-internship"
                className="group flex items-center justify-center px-6 py-3 bg-white/90 backdrop-blur-sm
                text-base font-semibold font-accent rounded-lg text-gray-700 border border-gray-200/50
                shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 ease-out"
              >
                <Briefcase size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Post Internship
              </Link>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="relative flex justify-center items-center">
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-xl rotate-12 opacity-60 animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg -rotate-12 opacity-40 animate-bounce"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-md mx-auto">
              <img
                src="/src/images/internship.jpeg"
                alt="internships image"
                className="rounded-l w-full object-cover h-84 sm:h-80 shadow-lg"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-cyan-100">
                <div className="text-lg font-bold text-cyan-500">1000+</div>
                <div className="text-xs text-gray-600">Companies</div>
              </div>
              
              <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-blue-100">
                <div className="text-lg font-bold text-blue-500">10K+</div>
                <div className="text-xs text-gray-600">Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;