import { useState, useEffect } from 'react';
import { UserIcon, BuildingIcon, CheckCircleIcon, BrainIcon, RocketIcon, StarIcon, SearchIcon, TargetIcon, ClipboardIcon, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../lib/new-api-client';
import { toast } from '@/hooks/use-toast';

const Services = () => {
  const [content, setContent] = useState({
    studentServices: [
      {
        title: "Internship Discovery",
        description: "Access thousands of verified internship opportunities across all industries"
      },
      {
        title: "Profile Optimization",
        description: "AI-powered suggestions to enhance your profile and stand out to employers"
      },
      {
        title: "Application Tracking",
        description: "Monitor your application status and receive real-time updates"
      },
      {
        title: "Career Guidance",
        description: "Expert advice and resources to help you make informed career decisions"
      }
    ],
    companyServices: [
      {
        title: "Talent Acquisition",
        description: "Access a diverse pool of pre-vetted students from top universities"
      },
      {
        title: "Smart Matching",
        description: "AI-powered algorithms to find the best candidates for your positions"
      },
      {
        title: "Application Management",
        description: "Streamlined dashboard to review, filter, and manage all applications"
      },
      {
        title: "Brand Building",
        description: "Showcase your company culture and attract top talent to your organization"
      }
    ],
    premiumServices: [
      {
        title: "Skills Assessment",
        description: "Comprehensive skill evaluations to help students identify strengths and companies find the right talent.",
        features: [
          "Technical skill testing",
          "Soft skills evaluation",
          "Industry-specific assessments",
          "Detailed performance reports"
        ],
        icon: "BrainIcon"
      },
      {
        title: "Fast Placement",
        description: "Quick and efficient matching process that gets students placed in internships within days, not weeks.",
        features: [
          "Priority application processing",
          "Direct company connections",
          "Expedited interview scheduling",
          "Real-time status updates"
        ],
        icon: "RocketIcon"
      },
      {
        title: "Success Support",
        description: "Ongoing mentorship and support throughout the internship journey to ensure mutual success.",
        features: [
          "Dedicated success manager",
          "Weekly check-ins",
          "Performance feedback",
          "Career development planning"
        ],
        icon: "StarIcon"
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: "Explore",
        description: "Browse through thousands of internship opportunities filtered by your preferences",
        icon: "SearchIcon"
      },
      {
        step: 2,
        title: "Match",
        description: "Our AI algorithm matches you with the most suitable opportunities based on your profile",
        icon: "TargetIcon"
      },
      {
        step: 3,
        title: "Apply",
        description: "Submit applications with one click and track your progress in real-time",
        icon: "ClipboardIcon"
      },
      {
        step: 4,
        title: "Succeed",
        description: "Get matched with your ideal internship and receive ongoing support for success",
        icon: "TrendingUpIcon"
      }
    ],
    stats: [
      { value: "10K+", label: "Internship Opportunities", description: "From top companies worldwide" },
      { value: "5K+", label: "Successful Placements", description: "Students placed in dream roles" },
      { value: "95%", label: "Satisfaction Rate", description: "Of students and employers" }
    ]
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await servicesAPI.getContent();
        setContent(response.data.data);
      } catch (error: any) {
        console.error('Failed to fetch services content:', error);
        toast({
          title: "Error",
          description: "Failed to load services content. Using default content.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Map icon names to actual components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'UserIcon': return UserIcon;
      case 'BuildingIcon': return BuildingIcon;
      case 'CheckCircleIcon': return CheckCircleIcon;
      case 'BrainIcon': return BrainIcon;
      case 'RocketIcon': return RocketIcon;
      case 'StarIcon': return StarIcon;
      case 'SearchIcon': return SearchIcon;
      case 'TargetIcon': return TargetIcon;
      case 'ClipboardIcon': return ClipboardIcon;
      case 'TrendingUpIcon': return TrendingUpIcon;
      default: return UserIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services content...</p>
        </div>
      </div>
    );
  }

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
                  {content.studentServices.map((service, index) => (
                    <div className="flex items-start" key={index}>
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                        <CheckCircleIcon size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{service.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  ))}
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
                  {content.companyServices.map((service, index) => (
                    <div className="flex items-start" key={index}>
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 transition-colors duration-300">
                        <CheckCircleIcon size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{service.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  ))}
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
            {content.premiumServices.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              const bgColorClasses = [
                'bg-primary/10 text-primary group-hover:bg-primary/20',
                'bg-secondary/10 text-secondary group-hover:bg-secondary/20',
                'bg-accent/10 text-accent group-hover:bg-accent/20'
              ];
              
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group overflow-hidden hover:border-primary"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${bgColorClasses[index % bgColorClasses.length]} rounded-full flex items-center justify-center mb-6 mx-auto transition-colors duration-300`}>
                      <IconComponent size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-3 mb-6 text-left">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
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
              {content.howItWorks.map((step, index) => {
                const IconComponent = getIconComponent(step.icon);
                const bgColorClasses = [
                  'bg-primary',
                  'bg-secondary',
                  'bg-accent',
                  'bg-destructive'
                ];
                
                const textColorClasses = [
                  'text-primary-foreground',
                  'text-secondary-foreground',
                  'text-accent-foreground',
                  'text-destructive-foreground'
                ];
                
                const hoverBgClasses = [
                  'group-hover:bg-primary/20',
                  'group-hover:bg-secondary/20',
                  'group-hover:bg-accent/20',
                  'group-hover:bg-destructive/20'
                ];
                
                return (
                  <div 
                    key={index} 
                    className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center border border-border relative group hover:border-primary"
                  >
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 ${bgColorClasses[index % bgColorClasses.length]} rounded-full flex items-center justify-center ${textColorClasses[index % textColorClasses.length]} font-bold text-lg border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.step}
                    </div>
                    <div className="pt-8">
                      <div className={`w-16 h-16 ${bgColorClasses[index % bgColorClasses.length]}/10 rounded-full flex items-center justify-center mb-6 mx-auto ${textColorClasses[index % textColorClasses.length]} ${hoverBgClasses[index % hoverBgClasses.length]} transition-colors duration-300`}>
                        <IconComponent size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
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
              {content.stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:bg-card transition-all duration-300 shadow-sm"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{stat.value}</div>
                  <div className="text-base md:text-lg text-foreground">{stat.label}</div>
                  <div className="text-xs md:text-sm mt-2 text-muted-foreground">{stat.description}</div>
                </div>
              ))}
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