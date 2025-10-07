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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">

              Quick and simple steps to connect students with the best opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <SearchIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Internships</h3>
              <p className="text-gray-600">
                “Explore hundreds of internships available on our platform and easily
                narrow your search by location, industry, and duration. Whether you’re
                looking for part-time, full-time, or remote opportunities, 
                our filters help you find internships that 
                match your skills and career goals, making the process simple and efficient.”   
             </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <UserIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply with One Click</h3>
              <p className="text-gray-600">
              “Apply for internships directly through our platform with ease. 
              Complete your profile, upload your resume and supporting documents,
               and submit your application in just a few clicks. Track your applications,
               receive updates from companie
              s, and take the next step in building your career—all in one convenient place.”
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <BuildingIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Organizations</h3>
              <p className="text-gray-600">
                “Take control of your career and apply for internships directly on our platform.
                 Fill out your profile, upload your resume and documents, 
                and submit applications in just a few clicks. Stay organized, 
                track your progress, connect with top companies,
                 and explore exciting opportunities that match your skills and ambitions.”
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Internships Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Internships
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Discover top opportunities from leading companies
              </p>
            </div>
            <Link to="/search" className="text-emerald-600 font-medium hover:text-emerald-800 flex items-center">
              View all
              <TrendingUpIcon size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map(internship => <InternshipCard key={internship.id} internship={internship} />)}
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Next Internship?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who have found their perfect internship
            match on our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/search" className="px-8 py-3 bg-white text-emerald-600 font-medium rounded-md hover:bg-gray-100">
              Browse Internships
            </Link>
            <Link to="/post-internship" className="px-8 py-3 bg-emerald-700 text-white font-medium rounded-md hover:bg-emerald-800">
              Post an Internship
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;