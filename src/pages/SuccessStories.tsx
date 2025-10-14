import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  ArrowLeft,
  Quote,
  MapPin,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define types for our success story data
interface SuccessStory {
  id: number;
  name: string;
  role: string;
  company: string;
  university: string;
  major: string;
  location: string;
  internshipPeriod: string;
  story: string;
  achievements: string[];
  image: string;
  tags: string[];
}

// In a real implementation, this would connect to your backend
// For now, we'll keep the mock data since there are no specific success stories endpoints
const successStoriesAPI = {
  getAll: async (): Promise<SuccessStory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data since there's no backend endpoint for this yet
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Software Engineer',
        company: 'Tech Innovations Inc.',
        university: 'Stanford University',
        major: 'Computer Science',
        location: 'San Francisco, CA',
        internshipPeriod: 'Summer 2022',
        story: 'As a junior at Stanford, I was struggling to find relevant internship opportunities. InternMatch connected me with Tech Innovations Inc., where I worked on developing their new mobile application. The experience was transformative - I learned React Native, contributed to a production app, and received a full-time offer before graduation. The mentorship I received was invaluable.',
        achievements: [
          'Developed mobile app used by 100K+ users',
          'Presented at company-wide tech conference',
          'Received \'Intern of the Year\' award'
        ],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['technology', 'software-engineering', 'mobile-development']
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Marketing Manager',
        company: 'Global Media Group',
        university: 'University of California, Berkeley',
        major: 'Marketing',
        location: 'New York, NY',
        internshipPeriod: 'Fall 2021',
        story: 'I was unsure about my career path until I interned at Global Media Group through InternMatch. Working on their social media strategy team, I discovered my passion for digital marketing. The internship led to a full-time position, and I\'ve since been promoted twice. The skills I gained in analytics and campaign management have been crucial to my success.',
        achievements: [
          'Increased social media engagement by 150%',
          'Managed $500K advertising budget',
          'Led team of 3 junior marketers'
        ],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['marketing', 'digital-marketing', 'social-media']
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        role: 'Data Scientist',
        company: 'Analytics Pro',
        university: 'MIT',
        major: 'Data Science',
        location: 'Boston, MA',
        internshipPeriod: 'Spring 2022',
        story: 'InternMatch helped me secure an internship at Analytics Pro, where I worked on predictive modeling for healthcare applications. The experience confirmed my interest in using data for social good. I published two research papers during my internship and was offered a PhD position. The company later became my first job after graduation, and I continue to work on impactful projects.',
        achievements: [
          'Published 2 research papers',
          'Developed model with 95% accuracy',
          'Presented at international conference'
        ],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['data-science', 'healthcare', 'research']
      },
      {
        id: 4,
        name: 'David Kim',
        role: 'Product Designer',
        company: 'Creative Studio',
        university: 'Rhode Island School of Design',
        major: 'Industrial Design',
        location: 'Los Angeles, CA',
        internshipPeriod: 'Summer 2021',
        story: 'As an international student, I was worried about finding an internship in the competitive design field. InternMatch not only connected me with Creative Studio but also provided portfolio review services. My internship project became the foundation for my senior thesis, and I was offered a position before graduation. The experience taught me the importance of user-centered design.',
        achievements: [
          'Designed product used by Fortune 500 company',
          'Won internal design competition',
          'Mentored 2 junior designers'
        ],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['design', 'product-design', 'user-experience']
      },
      {
        id: 5,
        name: 'Priya Patel',
        role: 'Financial Analyst',
        company: 'Global Finance Corp',
        university: 'University of Chicago',
        major: 'Finance',
        location: 'Chicago, IL',
        internshipPeriod: 'Winter 2022',
        story: 'InternMatch helped me find an internship at Global Finance Corp during my junior year. Working on their investment analysis team, I developed financial models that were used in client presentations. The experience solidified my interest in investment banking, and I secured a summer analyst position at a top firm. The networking opportunities through InternMatch were invaluable.',
        achievements: [
          'Built financial model used in 15 client presentations',
          'Received offer for summer analyst program',
          'Presented to C-suite executives'
        ],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['finance', 'investment-banking', 'financial-analysis']
      },
      {
        id: 6,
        name: 'James Wilson',
        role: 'Operations Manager',
        company: 'Logistics Solutions',
        university: 'Georgia Tech',
        major: 'Industrial Engineering',
        location: 'Atlanta, GA',
        internshipPeriod: 'Spring 2022',
        story: 'Through InternMatch, I landed an operations internship at Logistics Solutions. I optimized their warehouse layout, resulting in a 20% increase in efficiency. The experience showed me the impact of engineering in real-world applications. I was offered a full-time position and promoted within a year. The problem-solving skills I developed have been crucial to my career.',
        achievements: [
          'Increased warehouse efficiency by 20%',
          'Implemented new inventory system',
          'Led cross-functional team project'
        ],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['operations', 'logistics', 'engineering']
      }
    ];
  }
};

const SuccessStories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch success stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await successStoriesAPI.getAll();
        setStories(data);
      } catch (err) {
        console.error('Failed to fetch success stories:', err);
        setError('Failed to load success stories. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load success stories.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const filters = [
    { id: 'all', name: 'All Stories' },
    { id: 'technology', name: 'Technology' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'finance', name: 'Finance' },
    { id: 'operations', name: 'Operations' }
  ];

  const filteredStories = activeFilter === 'all' 
    ? stories 
    : stories.filter(story => story.tags.includes(activeFilter));

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
            <h1 className="text-3xl font-bold">Success Stories</h1>
            <p className="mt-2 text-primary-foreground/90">
              Inspiring journeys of students who found their dream internships through InternMatch
            </p>
          </div>
          
          <div className="p-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map(filter => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
            
            {/* Stories Grid */}
            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map(story => (
                  <Card key={story.id} className="border border-border hover:border-primary transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <img 
                            src={story.image} 
                            alt={story.name} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <CardTitle className="text-lg font-bold text-foreground">{story.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{story.role} at {story.company}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin size={14} className="mr-1" />
                            {story.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <GraduationCap size={14} className="mr-1" />
                        {story.university} • {story.major}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Calendar size={14} className="mr-1" />
                        {story.internshipPeriod}
                      </div>
                      
                      <div className="relative mb-4">
                        <Quote size={20} className="text-primary absolute -top-2 -left-2" />
                        <p className="text-muted-foreground text-sm pl-6 italic">
                          {story.story.substring(0, 150)}...
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {story.achievements.slice(0, 2).map((achievement, index) => (
                            <li key={index} className="flex items-start text-sm text-muted-foreground">
                              <TrendingUp size={14} className="mr-2 mt-0.5 flex-shrink-0 text-primary" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {story.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No stories found</h3>
                <p className="text-muted-foreground">Try selecting a different category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;