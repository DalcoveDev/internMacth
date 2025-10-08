import { HeartIcon, ShieldIcon, UsersIcon, AwardIcon } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About InternMatch</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're dedicated to bridging the gap between talented students and innovative companies, 
            creating meaningful connections that shape the future of work.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/images/new.jpeg" 
                  alt="Professional collaboration" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                  <h4 className="text-white font-bold text-xl mb-2">Building Connections</h4>
                  <p className="text-white/90 text-sm">Bridging the gap between talent and opportunity</p>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At InternMatch, we believe that every student deserves access to quality internship 
                opportunities that will kickstart their career. We're committed to democratizing 
                access to professional experiences and helping companies discover fresh talent.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform connects ambitious students with forward-thinking companies, 
                creating partnerships that drive innovation and growth for both parties.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600">10,000+</div>
                  <div className="text-sm text-gray-600">Students Placed</div>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600">500+</div>
                  <div className="text-sm text-gray-600">Partner Companies</div>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600">50+</div>
                  <div className="text-sm text-gray-600">Industries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-emerald-50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url('/images/Paper art and digital craft style of landscape with green eco urban city, earth day and world environment day concept_ _ Premium Vector.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose InternMatch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes our platform the preferred choice for students and companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <HeartIcon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Student-Focused</h4>
              <p className="text-sm text-gray-600">
                Every feature is designed with students' success in mind
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <ShieldIcon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Trusted Platform</h4>
              <p className="text-sm text-gray-600">
                Verified companies and secure application process
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <UsersIcon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
              <p className="text-sm text-gray-600">
                Join a network of ambitious students and mentors
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <AwardIcon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Excellence</h4>
              <p className="text-sm text-gray-600">
                Award-winning platform recognized by industry leaders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="text-lg text-gray-600 space-y-6">
              <p>
                InternMatch was founded in 2020 by a team of former students and industry professionals 
                who experienced firsthand the challenges of finding meaningful internship opportunities. 
                We noticed a disconnect between talented students seeking real-world experience and 
                companies looking for fresh perspectives.
              </p>
              <p>
                What started as a simple idea to connect students with internships has grown into a 
                comprehensive platform that serves thousands of users across multiple countries. 
                Our success is measured not just in numbers, but in the careers we've helped launch 
                and the innovations we've enabled.
              </p>
              <p>
                Today, we continue to evolve our platform based on feedback from our community, 
                always with the goal of making internship discovery and hiring more efficient, 
                transparent, and accessible for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              These fundamental principles drive our mission and shape every decision we make at InternMatch
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Purpose-Driven Value */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Purpose-Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                We connect people with opportunities that align with their passions and career goals, 
                creating meaningful professional relationships that drive mutual success.
              </p>
            </div>

            {/* Inclusive Value */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Inclusive</h3>
              <p className="text-gray-600 leading-relaxed">
                We're committed to creating opportunities for students from all backgrounds, 
                ensuring diversity and equal access to career development for everyone.
              </p>
            </div>

            {/* Innovation Value */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously improve our platform using cutting-edge technology to make 
                the internship search and hiring process more efficient and effective.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;