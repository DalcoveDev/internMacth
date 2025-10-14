import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  Clock, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define types for our career guidance resources
interface CareerResource {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  level: string;
  icon: string;
  tags: string[];
  content: string;
}

// In a real implementation, this would connect to your backend
// For now, we'll keep the mock data since there are no specific career guidance endpoints
const careerGuidanceAPI = {
  getAllResources: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data since there's no backend endpoint for this yet
    return [
      {
        id: 1,
        title: 'Resume Writing Masterclass',
        category: 'resume',
        description: 'Learn how to craft a compelling resume that stands out to employers',
        duration: '45 min',
        level: 'Beginner',
        icon: 'BookOpen',
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
        icon: 'Users',
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
        icon: 'TrendingUp',
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
        icon: 'Target',
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
        icon: 'Lightbulb',
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
        icon: 'TrendingUp',
        tags: ['skills', 'development', 'professional'],
        content: 'Develop essential professional skills that will set you apart in the job market...'
      }
    ];
  }
};

const CareerGuidance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping
  const iconMap: Record<string, any> = {
    BookOpen,
    Users,
    TrendingUp,
    Target,
    Lightbulb
  };

  // Fetch career guidance resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await careerGuidanceAPI.getAllResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch career guidance resources:', err);
        setError('Failed to load career guidance resources. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load career guidance resources.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'resume', name: 'Resume & CV', count: resources.filter(r => r.category === 'resume').length },
    { id: 'interview', name: 'Interview Prep', count: resources.filter(r => r.category === 'interview').length },
    { id: 'networking', name: 'Networking', count: resources.filter(r => r.category === 'networking').length },
    { id: 'planning', name: 'Career Planning', count: resources.filter(r => r.category === 'planning').length },
    { id: 'industry', name: 'Industry Insights', count: resources.filter(r => r.category === 'industry').length },
    { id: 'skills', name: 'Skills Development', count: resources.filter(r => r.category === 'skills').length }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

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
                <Lightbulb className="flex-shrink-0 mt-1 mr-4 text-primary" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Your Career Development Journey</h2>
                  <p className="text-muted-foreground">
                    Whether you're just starting out or looking to advance your career, our resources are designed to help you at every stage. 
                    From crafting the perfect resume to acing your next interview, we've got you covered.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            
            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => {
                  const IconComponent = iconMap[resource.icon] || BookOpen;
                  return (
                    <Card key={resource.id} className="border border-border hover:border-primary transition-all duration-300 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2 mr-3">
                              <IconComponent size={20} className="text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-foreground">{resource.title}</CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock size={14} className="mr-1" />
                                {resource.duration}
                                <span className="mx-2">•</span>
                                <span className="capitalize">{resource.level}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Button className="w-full flex items-center justify-between">
                          Access Resource
                          <ChevronRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try selecting a different category.</p>
              </div>
            )}
            
            {/* Career Planning Section */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Create Your Career Plan</h2>
                  <p className="text-muted-foreground">
                    Get personalized career guidance based on your goals and interests.
                  </p>
                </div>
                <Button className="flex items-center">
                  <Target size={16} className="mr-2" />
                  Start Planning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;