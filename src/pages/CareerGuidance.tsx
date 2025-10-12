import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CareerGuidance = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const guidanceResources = [
    {
      id: 1,
      title: 'Resume Writing Masterclass',
      category: 'resume',
      description: 'Learn how to craft a compelling resume that stands out to employers',
      duration: '45 min',
      level: 'Beginner',
      icon: BookOpen,
      tags: ['resume', 'cv', 'application'],
      content: 'This comprehensive guide covers everything from formatting to content optimization...'
    },
    {
      id: 2,
      title: 'Interview Preparation Guide',
      category: 'interview',
      description: 'Master common interview questions and develop your communication skills',
      duration: '60 min',
      level: 'Intermediate',
      icon: Users,
      tags: ['interview', 'communication', 'preparation'],
      content: 'Prepare for your next interview with our expert tips and practice questions...'
    },
    {
      id: 3,
      title: 'Networking Strategies',
      category: 'networking',
      description: 'Build meaningful professional relationships that advance your career',
      duration: '30 min',
      level: 'Beginner',
      icon: TrendingUp,
      tags: ['networking', 'relationships', 'career'],
      content: 'Learn effective networking techniques to expand your professional circle...'
    },
    {
      id: 4,
      title: 'Career Path Planning',
      category: 'planning',
      description: 'Create a roadmap for your career development and goal achievement',
      duration: '50 min',
      level: 'Advanced',
      icon: Target,
      tags: ['planning', 'goals', 'development'],
      content: 'Develop a strategic plan for your career with our step-by-step approach...'
    },
    {
      id: 5,
      title: 'Industry Insights',
      category: 'industry',
      description: 'Stay updated on trends and opportunities in your field of interest',
      duration: '40 min',
      level: 'Intermediate',
      icon: Lightbulb,
      tags: ['industry', 'trends', 'opportunities'],
      content: 'Get valuable insights into various industries and emerging career paths...'
    },
    {
      id: 6,
      title: 'Professional Skills Development',
      category: 'skills',
      description: 'Enhance key professional skills that employers value most',
      duration: '55 min',
      level: 'Intermediate',
      icon: TrendingUp,
      tags: ['skills', 'development', 'professional'],
      content: 'Develop essential professional skills that will set you apart in the job market...'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', count: guidanceResources.length },
    { id: 'resume', name: 'Resume & CV', count: guidanceResources.filter(r => r.category === 'resume').length },
    { id: 'interview', name: 'Interview Prep', count: guidanceResources.filter(r => r.category === 'interview').length },
    { id: 'networking', name: 'Networking', count: guidanceResources.filter(r => r.category === 'networking').length },
    { id: 'planning', name: 'Career Planning', count: guidanceResources.filter(r => r.category === 'planning').length },
    { id: 'industry', name: 'Industry Insights', count: guidanceResources.filter(r => r.category === 'industry').length },
    { id: 'skills', name: 'Skills Development', count: guidanceResources.filter(r => r.category === 'skills').length }
  ];

  const filteredResources = activeCategory === 'all' 
    ? guidanceResources 
    : guidanceResources.filter(resource => resource.category === activeCategory);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost"
          className="flex items-center mb-6 text-primary hover:bg-accent"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Button>
        
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <h1 className="text-3xl font-bold">Career Guidance Center</h1>
            <p className="mt-2 text-primary-foreground/90">
              Resources to help you navigate your career journey and achieve your professional goals
            </p>
          </div>
          
          <div className="p-6">
            {/* Introduction */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Lightbulb size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Empowering Your Career Journey</h2>
                  <p className="text-muted-foreground">
                    Our career guidance resources are designed to help you develop essential skills, 
                    make informed decisions, and build a successful career. Whether you're just starting 
                    out or looking to advance, we have resources tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-accent'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <Card 
                    key={resource.id} 
                    className="border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                          {resource.level}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground mt-4">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock size={12} className="mr-1" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => {
                          // In a real app, this would open a modal or navigate to a detail page
                          alert(`Opening: ${resource.title}\n\n${resource.content}`);
                        }}
                      >
                        Access Resource
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Additional Resources */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Additional Career Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-border hover:border-primary transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Users size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Mentorship Program</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          Connect with industry professionals for personalized career guidance and support.
                        </p>
                        <Button variant="outline" size="sm">
                          Find a Mentor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-border hover:border-primary transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Calendar size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-foreground mb-2">Career Events</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          Join our webinars, workshops, and networking events to expand your knowledge.
                        </p>
                        <Button variant="outline" size="sm">
                          View Events
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Success Stories */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Success Stories</h3>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle size={24} className="text-primary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <blockquote className="text-foreground italic">
                      "The career guidance resources on InternMatch helped me refine my resume and prepare for interviews. 
                      I landed my dream internship at a top tech company!"
                    </blockquote>
                    <div className="mt-4">
                      <p className="font-medium text-foreground">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Computer Science Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;