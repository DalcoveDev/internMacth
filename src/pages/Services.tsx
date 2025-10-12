import { UserIcon, BuildingIcon, CheckCircleIcon, BrainIcon, RocketIcon, StarIcon, SearchIcon, TargetIcon, ClipboardIcon, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services Introduction with Side Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Image with Creative Design */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img 
                    src="/images/work.jpg" 
                    alt="Work development" 
                    className="w-full h-auto object-cover max-w-full rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-emerald-600/30 rounded-3xl"></div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 bg-card rounded-xl shadow-xl p-4 max-w-xs border border-border transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center transition-colors duration-300">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground text-sm">Proven Results</h5>
                      <p className="text-muted-foreground text-xs">95% Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 transition-colors duration-300">
                Our Approach
              </div>
              
              <h2 className="text-3xl font-bold text-foreground mb-6">Tailored Solutions for Every Need</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Whether you're a student looking to launch your career or a company seeking fresh talent, 
                we provide specialized services designed to meet your unique requirements.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform bridges the gap between ambition and opportunity, creating 
                meaningful connections that drive success for both students and employers.
              </p>
              
              {/* Feature Points */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0 transition-colors duration-300">
                    <span className="text-primary text-sm font-bold">1</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">AI-Powered Matching Technology</span>
                    <p className="text-muted-foreground text-sm mt-1">Intelligent algorithms that connect the right opportunities with the right candidates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0 transition-colors duration-300">
                    <span className="text-primary text-sm font-bold">2</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">24/7 Support & Guidance</span>
                    <p className="text-muted-foreground text-sm mt-1">Dedicated support team to assist you throughout your journey</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0 transition-colors duration-300">
                    <span className="text-primary text-sm font-bold">3</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Verified Companies & Opportunities</span>
                    <p className="text-muted-foreground text-sm mt-1">All listings are thoroughly vetted to ensure quality and legitimacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Student Services */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-border relative group overflow-hidden hover:border-primary">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <UserIcon size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">For Students</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Internship Discovery</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Access thousands of verified internship opportunities across all industries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Profile Optimization</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">AI-powered suggestions to enhance your profile and stand out to employers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Application Tracking</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Monitor your application status and receive real-time updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Career Guidance</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Expert advice and resources to help you make informed career decisions</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to="/signup" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                    Get Started as Student
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Company Services */}
            <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-border relative group overflow-hidden hover:border-primary">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mr-4 text-secondary group-hover:bg-secondary/20 transition-colors duration-300">
                    <BuildingIcon size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">For Companies</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Talent Acquisition</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Access a diverse pool of pre-vetted students from top universities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Smart Matching</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">AI-powered algorithms to find the best candidates for your positions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Application Management</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Streamlined dashboard to review, filter, and manage all applications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Brand Building</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Showcase your company culture and attract top talent to your organization</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to="/signup" className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                    Get Started as Company
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section className="py-20 bg-muted relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-5 right-5 w-16 h-16 rounded-full bg-primary/10"></div>
          <div className="absolute bottom-5 left-5 w-24 h-24 rounded-full bg-primary/5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Premium Services</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Enhanced features and personalized support to accelerate your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group overflow-hidden hover:border-primary">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  <BrainIcon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Skills Assessment</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comprehensive skill evaluations to help students identify strengths 
                  and companies find the right talent.
                </p>
                <ul className="text-sm text-muted-foreground space-y-3 mb-6 text-left">
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Technical skill testing</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Soft skills evaluation</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Industry-specific assessments</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Detailed performance reports</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group overflow-hidden hover:border-primary">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto text-secondary group-hover:bg-secondary/20 transition-colors duration-300">
                  <RocketIcon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Fast Placement</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Quick and efficient matching process that gets students placed 
                  in internships within days, not weeks.
                </p>
                <ul className="text-sm text-muted-foreground space-y-3 mb-6 text-left">
                  <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>Priority application processing</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>Direct company connections</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>Expedited interview scheduling</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>Real-time status updates</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group overflow-hidden hover:border-primary">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 mx-auto text-accent group-hover:bg-accent/20 transition-colors duration-300">
                  <StarIcon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Success Support</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Ongoing mentorship and support throughout the internship journey 
                  to ensure mutual success.
                </p>
                <ul className="text-sm text-muted-foreground space-y-3 mb-6 text-left">
                  <li className="flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-3"></span>Dedicated success manager</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-3"></span>Weekly check-ins</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-3"></span>Performance feedback</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-3"></span>Career development planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Simple steps to connect students with the best opportunities
            </p>
          </div>
          
          {/* Horizontal Timeline Design */}
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group hover:border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <SearchIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Explore</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Browse through thousands of internship opportunities filtered by your preferences
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group hover:border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-lg border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="pt-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto text-secondary group-hover:bg-secondary/20 transition-colors duration-300">
                    <TargetIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Match</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our AI algorithm matches you with the most suitable opportunities based on your profile
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group hover:border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="pt-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 mx-auto text-accent group-hover:bg-accent/20 transition-colors duration-300">
                    <ClipboardIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Apply</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Submit applications with one click and track your progress in real-time
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group hover:border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-bold text-lg border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <div className="pt-8">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6 mx-auto text-destructive group-hover:bg-destructive/20 transition-colors duration-300">
                    <TrendingUpIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Succeed</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get matched with your ideal internship and receive ongoing support for success
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent text-foreground relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/10"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/10"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-primary/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30 mb-6 transition-colors duration-300">
              <span className="text-sm font-medium text-foreground">Join Our Community</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
              Ready to Transform Your Career?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-12 leading-relaxed max-w-3xl mx-auto text-foreground/80">
              Join thousands of students and companies who trust InternMatch 
              for their internship and hiring needs.
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:bg-card transition-all duration-300 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">10K+</div>
                <div className="text-base md:text-lg text-foreground">Internship Opportunities</div>
                <div className="text-xs md:text-sm mt-2 text-muted-foreground">From top companies worldwide</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:bg-card transition-all duration-300 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">5K+</div>
                <div className="text-base md:text-lg text-foreground">Successful Placements</div>
                <div className="text-xs md:text-sm mt-2 text-muted-foreground">Students placed in dream roles</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:bg-card transition-all duration-300 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">95%</div>
                <div className="text-base md:text-lg text-foreground">Satisfaction Rate</div>
                <div className="text-xs md:text-sm mt-2 text-muted-foreground">Of students and employers</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup" className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                Sign Up Now
              </Link>
              <Link to="/search" className="group px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-secondary/90 border-2 border-border transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                Browse Internships
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-border/20">
              <p className="text-base sm:text-lg mb-6 text-foreground/80">Trusted by leading universities and companies</p>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-80">
                <div className="text-base sm:text-lg font-bold text-foreground">Stanford</div>
                <div className="text-base sm:text-lg font-bold text-foreground">Microsoft</div>
                <div className="text-base sm:text-lg font-bold text-foreground">Google</div>
                <div className="text-base sm:text-lg font-bold text-foreground">Harvard</div>
                <div className="text-base sm:text-lg font-bold text-foreground">Amazon</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;