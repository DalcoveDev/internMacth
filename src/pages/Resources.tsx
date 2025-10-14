import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ArrowLeft,
  Search,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define types for our resources data
interface Resource {
  id: number;
  title: string;
  type: string;
  category: string;
  description: string;
  author: string;
  duration: string;
  rating: number;
  downloads: number;
  icon: string;
  tags: string[];
  content: string;
}

// In a real implementation, this would connect to your backend
// For now, we'll keep the mock data since there are no specific resources endpoints
const resourcesAPI = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data since there's no backend endpoint for this yet
    return [
      {
        id: 1,
        title: 'Ultimate Internship Guide',
        type: 'guide',
        category: 'internships',
        description: 'Comprehensive guide covering everything you need to know about internships',
        author: 'InternMatch Team',
        duration: '45 min read',
        rating: 4.8,
        downloads: 1240,
        icon: 'BookOpen',
        tags: ['internships', 'guide', 'career'],
        content: 'This comprehensive guide covers everything from finding the right internship to making the most of your experience...'
      },
      {
        id: 2,
        title: 'Resume Writing Workshop',
        type: 'video',
        category: 'resume',
        description: 'Step-by-step video tutorial on crafting the perfect resume',
        author: 'Career Services Pro',
        duration: '60 min',
        rating: 4.9,
        downloads: 890,
        icon: 'Video',
        tags: ['resume', 'cv', 'writing'],
        content: 'Learn how to create a standout resume that gets noticed by employers...'
      },
      {
        id: 3,
        title: 'Interview Preparation Checklist',
        type: 'template',
        category: 'interview',
        description: 'Downloadable checklist to prepare for your next interview',
        author: 'HR Experts Group',
        duration: '15 min read',
        rating: 4.7,
        downloads: 2100,
        icon: 'FileText',
        tags: ['interview', 'preparation', 'checklist'],
        content: 'Use this comprehensive checklist to ensure you\'re fully prepared for your next interview...'
      },
      {
        id: 4,
        title: 'Networking Strategies PDF',
        type: 'document',
        category: 'networking',
        description: 'Essential networking strategies for career success',
        author: 'Professional Networkers',
        duration: '30 min read',
        rating: 4.6,
        downloads: 1560,
        icon: 'Download',
        tags: ['networking', 'relationships', 'career'],
        content: 'Discover proven networking strategies that will help you build meaningful professional relationships...'
      },
      {
        id: 5,
        title: 'Industry Salary Reports 2023',
        type: 'report',
        category: 'industry',
        description: 'Comprehensive salary data across various industries',
        author: 'Compensation Analytics',
        duration: '25 min read',
        rating: 4.9,
        downloads: 3420,
        icon: 'FileText',
        tags: ['salary', 'industry', 'compensation'],
        content: 'Access the latest salary data across various industries to help with negotiation...'
      },
      {
        id: 6,
        title: 'Professional Skills Assessment',
        type: 'tool',
        category: 'skills',
        description: 'Interactive tool to evaluate and improve your professional skills',
        author: 'Skill Development Institute',
        duration: '20 min',
        rating: 4.8,
        downloads: 980,
        icon: 'Award',
        tags: ['skills', 'assessment', 'development'],
        content: 'Use this interactive tool to assess your professional skills and identify areas for improvement...'
      },
      {
        id: 7,
        title: 'LinkedIn Profile Optimization',
        type: 'guide',
        category: 'networking',
        description: 'Complete guide to optimizing your LinkedIn profile for career opportunities',
        author: 'Social Media Careers',
        duration: '35 min read',
        rating: 4.7,
        downloads: 1750,
        icon: 'BookOpen',
        tags: ['linkedin', 'profile', 'networking'],
        content: 'Learn how to optimize your LinkedIn profile to attract recruiters and career opportunities...'
      },
      {
        id: 8,
        title: 'Cover Letter Templates',
        type: 'template',
        category: 'resume',
        description: 'Professional cover letter templates for various industries',
        author: 'Career Writing Experts',
        duration: '10 min read',
        rating: 4.5,
        downloads: 2300,
        icon: 'FileText',
        tags: ['cover-letter', 'templates', 'application'],
        content: 'Download these professionally designed cover letter templates to enhance your job applications...'
      }
    ];
  }
};

const Resources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping
  const iconMap: Record<string, any> = {
    BookOpen,
    Video,
    FileText,
    Download,
    Award
  };

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourcesAPI.getAll();
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Failed to load resources. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load resources.",
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
    { id: 'internships', name: 'Internships', count: resources.filter(r => r.category === 'internships').length },
    { id: 'resume', name: 'Resume & Cover Letters', count: resources.filter(r => r.category === 'resume').length },
    { id: 'interview', name: 'Interview Prep', count: resources.filter(r => r.category === 'interview').length },
    { id: 'networking', name: 'Networking', count: resources.filter(r => r.category === 'networking').length },
    { id: 'industry', name: 'Industry Insights', count: resources.filter(r => r.category === 'industry').length },
    { id: 'skills', name: 'Skills Development', count: resources.filter(r => r.category === 'skills').length }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
            <h1 className="text-3xl font-bold">Learning Resources</h1>
            <p className="mt-2 text-primary-foreground/90">
              Access guides, templates, and tools to advance your career
            </p>
          </div>
          
          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-ring focus:border-ring focus:ring-2 transition-all bg-background text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setActiveCategory(category.id)}
                    className="text-sm"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => {
                  const IconComponent = iconMap[resource.icon] || BookOpen;
                  return (
                    <Card key={resource.id} className="border border-border hover:border-primary transition-all duration-300 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2 mr-3">
                              <IconComponent size={20} className="text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-foreground">{resource.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{resource.author}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {resource.type}
                          </span>
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
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {resource.duration}
                          </div>
                          <div className="flex items-center">
                            <Star size={16} className="mr-1 fill-yellow-400 text-yellow-400" />
                            {resource.rating}
                          </div>
                          <div className="flex items-center">
                            <Download size={16} className="mr-1" />
                            {resource.downloads}
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          Access Resource
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
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;