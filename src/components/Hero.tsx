import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 text-gray-800 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200/60 shadow-sm">
              <Search size={16} className="mr-2 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Empowering Career Growth</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-gray-800 leading-tight">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Perfect</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Internship</span> for You
            </h1>
            
            <p className="text-lg font-body text-gray-500 leading-relaxed max-w-xl">
              Discover amazing opportunities with top companies and kickstart your dream career. Your journey to success starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary Search Button */}
              <Link
                to="/search"
                className="group flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700
                text-base font-semibold font-accent rounded-lg text-white shadow-md transition-colors"
              >
                <Search size={18} className="mr-2" />
                Find Internships
              </Link>
              
              {/* Secondary Button */}
              <Link
                to="/post-internship"
                className="group flex items-center justify-center px-6 py-3 bg-white
                text-base font-semibold font-accent rounded-lg text-gray-700 border border-gray-300
                hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                <Briefcase size={18} className="mr-2" />
                Post Internship
              </Link>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="relative flex justify-center items-center">
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-emerald-200 to-green-200 rounded-xl rotate-12 opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg -rotate-12 opacity-40"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-md mx-auto">
              <img
                src="/src/images/internship.jpeg"
                alt="internships image"
                className="rounded-l w-full object-cover h-84 sm:h-80 shadow-lg"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-emerald-100">
                <div className="text-lg font-bold text-emerald-600">1000+</div>
                <div className="text-xs text-gray-600">Companies</div>
              </div>
              
              <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-emerald-100">
                <div className="text-lg font-bold text-emerald-600">10K+</div>
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