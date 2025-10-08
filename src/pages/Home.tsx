import Hero from '../components/Hero';
import InternshipCard from '../components/InternshipCard';
import { Link } from 'react-router-dom';
import { TrendingUpIcon, UserIcon, BuildingIcon, SearchIcon } from 'lucide-react';
// Sample data for featured internships
const featuredInternships = [{
  id: 1,
  title: 'Software Development Intern',
  company: 'Tech Innovations Inc.',
  location: 'San Francisco, CA',
  type: 'Full-time',
  duration: '3 months',
  description: "Join our engineering team to develop cutting-edge web applications using React and Node.js. You'll work directly with senior developers on real projects.",
  requirements: ['React', 'JavaScript', 'Node.js'],
  postedDate: '2 days ago',
  deadline: 'May 30, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 2,
  title: 'Marketing Intern',
  company: 'Global Media Group',
  location: 'New York, NY',
  type: 'Part-time',
  duration: '6 months',
  description: 'Assist our marketing team in developing and implementing digital marketing campaigns. Learn about SEO, content marketing, and social media strategy.',
  requirements: ['Marketing', 'Social Media', 'Content Creation'],
  postedDate: '1 week ago',
  deadline: 'June 15, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 3,
  title: 'Data Science Intern',
  company: 'Analytics Pro',
  location: 'Remote',
  type: 'Full-time',
  duration: '4 months',
  description: 'Work with our data science team to analyze large datasets and build predictive models. Great opportunity to apply machine learning skills in a real-world setting.',
  requirements: ['Python', 'Machine Learning', 'Data Analysis'],
  postedDate: '3 days ago',
  deadline: 'May 25, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}];
const Home = () => {
  // Removed handleApply function as we now navigate to dedicated application form
  return <div>
      <Hero />
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Quick and simple steps to connect students with the best opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <SearchIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Internships</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore hundreds of internships available on our platform and easily
                narrow your search by location, industry, and duration. Whether you're
                looking for part-time, full-time, or remote opportunities, 
                our filters help you find internships that 
                match your skills and career goals, making the process simple and efficient.
             </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <UserIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply with One Click</h3>
              <p className="text-gray-600 leading-relaxed">
              Apply for internships directly through our platform with ease. 
              Complete your profile, upload your resume and supporting documents,
               and submit your application in just a few clicks. Track your applications,
               receive updates from companies,
              and take the next step in building your career—all in one convenient place.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BuildingIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Organizations</h3>
              <p className="text-gray-600 leading-relaxed">
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
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url('/images/download.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn More About InternMatch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how we're revolutionizing the internship experience
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/about" className="group px-8 py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              About Us
            </Link>
            <Link to="/services" className="group px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Our Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Internships Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Featured Internships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover top opportunities from leading companies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map(internship => <InternshipCard key={internship.id} internship={internship} />)}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/search" className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md">
              View All Internships
              <TrendingUpIcon size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-blue-600/90"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Internship
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who found their ideal internship match
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/search" className="group px-10 py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Browse Internships
            </Link>
            <Link to="/post-internship" className="group px-10 py-4 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 border-2 border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Post an Internship
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;