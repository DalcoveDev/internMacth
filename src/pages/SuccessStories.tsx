import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  ArrowLeft,
  Quote,
  MapPin,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SuccessStories = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const stories = [
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
            <h1 className="text-3xl font-bold">Success Stories</h1>
            <p className="mt-2 text-primary-foreground/90">
              Inspiring journeys of students who transformed their careers through internships
            </p>
          </div>
          
          <div className="p-6">
            {/* Introduction */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Award size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Celebrating Career Transformations</h2>
                  <p className="text-muted-foreground">
                    These stories showcase how internships can be pivotal in shaping successful careers. 
                    Each journey is unique, but all share the common thread of growth, learning, and opportunity.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Success Stories</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Placement Rate</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Industries</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Students Helped</div>
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-accent'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            
            {/* Stories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStories.map((story) => (
                <Card 
                  key={story.id} 
                  className="border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start">
                      <div className="relative">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Award size={12} className="text-primary-foreground" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <CardTitle className="text-xl font-bold text-foreground">
                          {story.name}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {story.role} at {story.company}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <GraduationCap size={16} className="mr-1" />
                        <span>{story.university}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building size={16} className="mr-1" />
                        <span>{story.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="mr-1" />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={16} className="mr-1" />
                        <span>{story.internshipPeriod}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Quote size={20} className="text-primary mb-2" />
                      <p className="text-muted-foreground italic">
                        {story.story}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-bold text-foreground mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {story.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Share Your Success Story</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Have an inspiring internship journey to share? We'd love to feature your story and 
                  help inspire other students in their career paths.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="default">
                    Submit Your Story
                  </Button>
                  <Button variant="outline">
                    View All Stories
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                <div className="flex items-start">
                  <Quote size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg text-foreground italic mb-4">
                      "InternMatch transformed my career trajectory. The internship I found through 
                      their platform not only gave me practical experience but also led to a full-time 
                      position with incredible growth opportunities. The support throughout the process 
                      was exceptional."
                    </p>
                    <div>
                      <p className="font-bold text-foreground">Alex Thompson</p>
                      <p className="text-muted-foreground">Senior Software Engineer, Microsoft</p>
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

export default SuccessStories;