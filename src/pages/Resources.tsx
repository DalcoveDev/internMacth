import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  ArrowLeft,
  Search,
  Bookmark,
  Star,
  Clock,
  User,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
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
      icon: BookOpen,
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
      icon: Video,
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
      icon: FileText,
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
      icon: Download,
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
      icon: FileText,
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
      icon: Award,
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
      icon: BookOpen,
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
      icon: FileText,
      tags: ['cover-letter', 'templates', 'application'],
      content: 'Download these professionally designed cover letter templates to enhance your job applications...'
    }
  ];

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
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'template': return FileText;
      case 'report': return FileText;
      case 'tool': return Award;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-primary/10 text-primary';
    }
  };

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
          Back
        </Button>
        
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <h1 className="text-3xl font-bold">Career Resources Library</h1>
            <p className="mt-2 text-primary-foreground/90">
              Downloadable guides, templates, and tools to advance your career
            </p>
          </div>
          
          <div className="p-6">
            {/* Introduction */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <BookOpen size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Empower Your Career Development</h2>
                  <p className="text-muted-foreground">
                    Access our curated collection of resources designed to help you succeed in your career journey. 
                    From resume templates to industry insights, we have everything you need to take the next step.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                const TypeIcon = getTypeIcon(resource.type);
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
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            <TypeIcon size={12} className="mr-1" />
                            {resource.type}
                          </span>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Bookmark size={16} className="text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground mt-4">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <User size={12} className="mr-1" />
                        <span className="mr-3">{resource.author}</span>
                        <Clock size={12} className="mr-1" />
                        <span>{resource.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-foreground ml-1">{resource.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({resource.downloads} downloads)</span>
                        </div>
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
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          className="flex-1"
                          onClick={() => {
                            // In a real app, this would download or open the resource
                            alert(`Accessing: ${resource.title}\n\n${resource.content}`);
                          }}
                        >
                          <Download size={16} className="mr-2" />
                          Access
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open in a new tab
                            alert(`Opening external link for: ${resource.title}`);
                          }}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Resource Categories */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Resource Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg hover:bg-accent transition-colors duration-300 cursor-pointer">
                  <div className="flex items-center">
                    <BookOpen size={20} className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium text-foreground">Guides & E-books</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive resources for in-depth learning</p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg hover:bg-accent transition-colors duration-300 cursor-pointer">
                  <div className="flex items-center">
                    <Video size={20} className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium text-foreground">Video Tutorials</h4>
                      <p className="text-sm text-muted-foreground">Step-by-step visual learning experiences</p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg hover:bg-accent transition-colors duration-300 cursor-pointer">
                  <div className="flex items-center">
                    <FileText size={20} className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium text-foreground">Templates & Tools</h4>
                      <p className="text-sm text-muted-foreground">Ready-to-use resources for immediate application</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submission CTA */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Have Resources to Share?</h3>
                  <p className="text-muted-foreground mb-4">
                    Contribute to our community by sharing your career resources and insights
                  </p>
                  <Button variant="default">
                    Submit Resource
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;