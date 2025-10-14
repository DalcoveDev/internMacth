import { useState, useEffect } from 'react';
import { HeartIcon, ShieldIcon, UsersIcon, AwardIcon } from 'lucide-react';
import { aboutAPI } from '../lib/new-api-client';
import { toast } from '@/hooks/use-toast';

const About = () => {
  const [content, setContent] = useState({
    stats: [
      { value: '10,000+', label: 'Students Placed' },
      { value: '500+', label: 'Partner Companies' },
      { value: '95%', label: 'Success Rate' },
      { value: '50+', label: 'Industries' },
    ],
    values: [
      { 
        icon: 'HeartIcon', 
        title: 'Student-Focused', 
        description: 'Every feature is designed with students\' success in mind' 
      },
      { 
        icon: 'ShieldIcon', 
        title: 'Trusted Platform', 
        description: 'Verified companies and secure application process' 
      },
      { 
        icon: 'UsersIcon', 
        title: 'Community', 
        description: 'Join a network of ambitious students and mentors' 
      },
      { 
        icon: 'AwardIcon', 
        title: 'Excellence', 
        description: 'Award-winning platform recognized by industry leaders' 
      },
    ],
    coreValues: [
      {
        title: 'Purpose-Driven',
        description: 'We connect people with opportunities that align with their passions and career goals, creating meaningful professional relationships that drive mutual success.',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        iconClass: 'text-primary-foreground',
        bgClass: 'bg-primary'
      },
      {
        title: 'Inclusive',
        description: 'We\'re committed to creating opportunities for students from all backgrounds, ensuring diversity and equal access to career development for everyone.',
        iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        iconClass: 'text-secondary-foreground',
        bgClass: 'bg-secondary'
      },
      {
        title: 'Innovation',
        description: 'We continuously improve our platform using cutting-edge technology to make the internship search and hiring process more efficient and effective.',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        iconClass: 'text-accent-foreground',
        bgClass: 'bg-accent'
      }
    ],
    story: ''
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await aboutAPI.getContent();
        setContent(response.data.data);
      } catch (error: any) {
        console.error('Failed to fetch about content:', error);
        toast({
          title: "Error",
          description: "Failed to load about content. Using default content.",
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
      case 'HeartIcon': return HeartIcon;
      case 'ShieldIcon': return ShieldIcon;
      case 'UsersIcon': return UsersIcon;
      case 'AwardIcon': return AwardIcon;
      default: return HeartIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about content...</p>
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
          aria-hidden="true"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About InternMatch</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're dedicated to bridging the gap between talented students and innovative companies, 
            creating meaningful connections that shape the future of work.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/images/Internship.jpeg" 
                  alt="Professional collaboration between students and companies" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                  <h4 className="text-white font-bold text-xl mb-2">Building Connections</h4>
                  <p className="text-white/90 text-sm">Bridging the gap between talent and opportunity</p>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At InternMatch, we believe that every student deserves access to quality internship 
                opportunities that will kickstart their career. We're committed to democratizing 
                access to professional experiences and helping companies discover fresh talent.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform connects ambitious students with forward-thinking companies, 
                creating partnerships that drive innovation and growth for both parties.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {content.stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center bg-muted rounded-lg p-4 transition-colors duration-300 hover:bg-accent"
                  >
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards Section */}
      <section className="py-16 bg-muted relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
          aria-hidden="true"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose InternMatch</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes our platform the preferred choice for students and companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((value, index) => {
              const IconComponent = getIconComponent(value.icon);
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center border border-border hover:border-primary"
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 transition-colors duration-300">
                    <IconComponent size={24} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Story</h2>
            <div className="text-lg text-muted-foreground space-y-6">
              {content.story ? (
                <p>{content.story}</p>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 bg-gradient-to-br from-muted to-background relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
          aria-hidden="true"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              These fundamental principles drive our mission and shape every decision we make at InternMatch
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {content.coreValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center border border-border hover:border-primary"
              >
                <div className={`w-16 h-16 ${value.bgClass} rounded-full flex items-center justify-center mb-6 mx-auto transition-colors duration-300`}>
                  <svg 
                    className={`w-8 h-8 ${value.iconClass}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={value.iconPath} 
                    />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;