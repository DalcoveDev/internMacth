import { UserIcon, BuildingIcon, CheckCircleIcon, BrainIcon, RocketIcon, StarIcon, SearchIcon, TargetIcon, ClipboardIcon, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Comprehensive solutions for students and companies to achieve their goals 
            in the internship and early career space.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services Introduction with Side Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Image with Creative Design */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:rotate-1 transition-all duration-500">
                  <img 
                    src="/images/Daily 3D renders — abstract cloth edition.jpeg" 
                    alt="Innovative solutions" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-emerald-600/30"></div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">Proven Results</h5>
                      <p className="text-gray-600 text-xs">95% Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tailored Solutions for Every Need</h2>
              <p className="text-lg text-gray-600 mb-6">
                Whether you're a student looking to launch your career or a company seeking fresh talent, 
                we provide specialized services designed to meet your unique requirements.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our platform bridges the gap between ambition and opportunity, creating 
                meaningful connections that drive success for both students and employers.
              </p>
              
              {/* Feature Points */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-700 font-medium">AI-Powered Matching Technology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-700 font-medium">24/7 Support & Guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-700 font-medium">Verified Companies & Opportunities</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Student Services */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <UserIcon size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">For Students</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Internship Discovery</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Access thousands of verified internship opportunities across all industries</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Profile Optimization</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">AI-powered suggestions to enhance your profile and stand out to employers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Application Tracking</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Monitor your application status and receive real-time updates</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Career Guidance</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Expert advice and resources to help you make informed career decisions</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/signup" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                  Get Started as Student
                </Link>
              </div>
            </div>
            
            {/* Company Services */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <BuildingIcon size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">For Companies</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Talent Acquisition</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Access a diverse pool of pre-vetted students from top universities</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Smart Matching</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">AI-powered algorithms to find the best candidates for your positions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Application Management</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Streamlined dashboard to review, filter, and manage all applications</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <CheckCircleIcon size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Brand Building</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Showcase your company culture and attract top talent to your organization</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/signup" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md">
                  Get Started as Company
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('/images/Paper art and digital craft style of landscape with green eco urban city, earth day and world environment day concept_ _ Premium Vector.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Enhanced features and personalized support to accelerate your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BrainIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills Assessment</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive skill evaluations to help students identify strengths 
                and companies find the right talent.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Technical skill testing</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Soft skills evaluation</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Industry-specific assessments</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Detailed performance reports</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <RocketIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Placement</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Quick and efficient matching process that gets students placed 
                in internships within days, not weeks.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Priority application processing</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Direct company connections</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Expedited interview scheduling</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Real-time status updates</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <StarIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ongoing mentorship and support throughout the internship journey 
                to ensure mutual success.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Dedicated success manager</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Weekly check-ins</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Performance feedback</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Career development planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url('/images/Hot Air Balloon White Cloud PNG - Free Download.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Simple steps to connect students with the best opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100 relative">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <SearchIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Explore</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through thousands of internship opportunities filtered by your preferences
              </p>
              {/* Step indicator */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100 relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <TargetIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Match</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI algorithm matches you with the most suitable opportunities based on your profile
              </p>
              {/* Step indicator */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100 relative">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ClipboardIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit applications with one click and track your progress in real-time
              </p>
              {/* Step indicator */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100 relative">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <TrendingUpIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Succeed</h3>
              <p className="text-gray-600 leading-relaxed">
                Get matched with your ideal internship and receive ongoing support for success
              </p>
              {/* Step indicator */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-blue-600/90"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of students and companies who trust InternMatch 
            for their internship and hiring needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup" className="group px-10 py-4 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Sign Up Now
            </Link>
            <Link to="/search" className="group px-10 py-4 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 border-2 border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Browse Internships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;