import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Play,
  BookOpen,
  Target,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CompanyLanding = () => {
  const navigate = useNavigate();

  // Mock data for company stats
  const companyStats = [
    { icon: Users, label: 'Active Interns', value: '120+' },
    { icon: Building, label: 'Partner Companies', value: '500+' },
    { icon: TrendingUp, label: 'Placement Rate', value: '95%' },
    { icon: Award, label: 'Years Experience', value: '5+' }
  ];

  // Boosted company images
  const companyImages = [
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Modern office space'
    },
    {
      src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: 'Team collaboration'
    },
    {
      src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Successful internship program'
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      content: 'InternMatch has transformed our hiring process. We\'ve found exceptional talent and reduced our recruitment costs by 40%.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO, StartupXYZ',
      content: 'The quality of interns we\'ve hired through InternMatch is outstanding. They come prepared and ready to contribute from day one.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Talent Acquisition, GlobalTech',
      content: 'The platform\'s analytics help us understand our hiring patterns and improve our internship program continuously.',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  // Mock features
  const features = [
    {
      icon: Target,
      title: 'Targeted Matching',
      description: 'Our AI-powered algorithm connects you with students whose skills and interests align with your company needs.'
    },
    {
      icon: Lightbulb,
      title: 'Skill Assessment',
      description: 'Evaluate candidate skills through our comprehensive assessment tools before making hiring decisions.'
    },
    {
      icon: BookOpen,
      title: 'Intern Development',
      description: 'Provide structured learning paths and mentorship programs to maximize intern growth and retention.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track internship performance, candidate success metrics, and ROI through our comprehensive analytics.'
    }
  ];

  // Benefits for companies
  const companyBenefits = [
    {
      title: 'Access to Top Talent',
      description: 'Connect with pre-vetted students from leading universities and coding bootcamps.',
      icon: Users
    },
    {
      title: 'Cost-Effective Hiring',
      description: 'Reduce recruitment costs by up to 60% compared to traditional hiring methods.',
      icon: DollarSign
    },
    {
      title: 'Streamlined Process',
      description: 'Our all-in-one platform handles everything from posting to onboarding.',
      icon: Calendar
    },
    {
      title: 'Diverse Candidate Pool',
      description: 'Reach students from various backgrounds, disciplines, and skill levels.',
      icon: Award
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      description: 'Perfect for small businesses and startups',
      features: [
        'Post up to 3 internships',
        'Unlimited applications',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '$299',
      period: 'per month',
      description: 'Ideal for growing companies',
      features: [
        'Post up to 10 internships',
        'Advanced analytics',
        'AI-powered matching',
        'Priority support',
        'Custom branding'
      ],
      cta: 'Try Free for 14 Days',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited internships',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced reporting',
        'White-label solution'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                Build Your Future Workforce
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                Connect with top-tier talent, develop future leaders, and grow your organization with our comprehensive internship platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate('/signup?role=company')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-8 border border-border">
              <div className="text-center">
                <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Trusted by 500+ Companies</h3>
                <p className="text-muted-foreground mb-6">Join thousands of organizations transforming their internship programs</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="text-2xl font-bold text-foreground">10K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="text-2xl font-bold text-foreground">95%</div>
                    <div className="text-sm text-muted-foreground">Placement Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Images Section */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Trusted by Leading Companies
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of organizations transforming their internship programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companyImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Companies Choose InternMatch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides everything you need to build a successful internship program
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple & Effective Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with InternMatch in just a few easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Create Profile</h3>
              <p className="text-muted-foreground">
                Set up your company profile with details about your organization, culture, and internship opportunities.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Post Opportunities</h3>
              <p className="text-muted-foreground">
                Create and publish internship listings with detailed descriptions, requirements, and compensation.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Connect & Hire</h3>
              <p className="text-muted-foreground">
                Review applications, conduct interviews, and select the best candidates for your internships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits for Your Company
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Why thousands of companies trust InternMatch for their internship programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that works best for your organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-2xl border shadow-lg overflow-hidden ${
                  plan.popular 
                    ? 'border-primary ring-2 ring-primary/20 relative' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-sm font-bold py-1 text-center">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'border border-primary text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        navigate('/contact');
                      } else {
                        navigate('/signup?role=company');
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our platform
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                How long does it take to find qualified interns?
              </h3>
              <p className="text-muted-foreground">
                Most companies find qualified candidates within 7-14 days of posting their internship. 
                Our AI-powered matching system helps accelerate this process by connecting you with 
                students whose skills and interests align with your requirements.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What support do you provide during the internship?
              </h3>
              <p className="text-muted-foreground">
                We provide ongoing support throughout the internship period, including check-ins, 
                performance tracking tools, and resources to help ensure a successful experience 
                for both companies and interns. Our dedicated support team is available to address 
                any questions or concerns.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I customize the internship requirements?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! Our platform allows you to define specific requirements for each 
                internship, including skills, experience level, duration, location preferences, 
                and compensation. You can also update these requirements at any time.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                How do you ensure the quality of applicants?
              </h3>
              <p className="text-muted-foreground">
                We verify student credentials and provide skill assessment tools to help you 
                evaluate candidates. Additionally, our platform includes portfolio reviews, 
                academic verification, and reference checks to ensure you're connecting with 
                high-quality candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from companies that have transformed their hiring with InternMatch
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Join thousands of companies using InternMatch to find exceptional talent and build their future workforce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg py-3 px-8"
              onClick={() => navigate('/signup?role=company')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg py-3 px-8"
              onClick={() => navigate('/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyLanding;