import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Lightbulb, 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for community discussions
  const discussions = [
    {
      id: 1,
      title: 'Best resources for learning React in 2023?',
      author: 'Alex Chen',
      authorRole: 'Software Engineering Student',
      replies: 24,
      likes: 42,
      tags: ['react', 'frontend', 'resources'],
      timeAgo: '2 hours ago',
      content: 'I\'m looking for the best resources to learn React. Any recommendations for courses, books, or projects that helped you get started?'
    },
    {
      id: 2,
      title: 'How to negotiate internship salary?',
      author: 'Maria Rodriguez',
      authorRole: 'Marketing Intern',
      replies: 18,
      likes: 35,
      tags: ['salary', 'negotiation', 'internship'],
      timeAgo: '5 hours ago',
      content: 'I just received an internship offer but I\'m not sure how to approach salary negotiation. Any tips or resources would be greatly appreciated!'
    },
    {
      id: 3,
      title: 'Remote vs. in-person internships - pros and cons?',
      author: 'James Wilson',
      authorRole: 'Computer Science Student',
      replies: 32,
      likes: 56,
      tags: ['remote', 'in-person', 'work-environment'],
      timeAgo: '1 day ago',
      content: 'With more companies offering remote internships, I\'m curious about your experiences. What are the pros and cons of each, and which do you prefer?'
    },
    {
      id: 4,
      title: 'Transitioning from academia to industry',
      author: 'Dr. Sarah Kim',
      authorRole: 'Industry Mentor',
      replies: 15,
      likes: 28,
      tags: ['career-transition', 'academia', 'industry'],
      timeAgo: '1 day ago',
      content: 'For those who have made the transition from academia to industry, what challenges did you face and how did you overcome them?'
    }
  ];

  // Mock data for events
  const events = [
    {
      id: 1,
      title: 'Tech Industry Networking Night',
      date: 'June 15, 2023',
      time: '6:00 PM - 9:00 PM',
      location: 'San Francisco, CA',
      attendees: 120,
      type: 'Networking',
      description: 'Connect with professionals from leading tech companies and expand your network.'
    },
    {
      id: 2,
      title: 'Resume Workshop with HR Experts',
      date: 'June 18, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'Online',
      attendees: 85,
      type: 'Workshop',
      description: 'Learn how to craft a standout resume from HR professionals at top companies.'
    },
    {
      id: 3,
      title: 'Startup Career Fair',
      date: 'June 22, 2023',
      time: '10:00 AM - 4:00 PM',
      location: 'New York, NY',
      attendees: 200,
      type: 'Career Fair',
      description: 'Meet representatives from innovative startups and explore internship opportunities.'
    }
  ];

  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      title: 'First Internship Secured',
      description: 'Congratulations on landing your first internship!',
      icon: Trophy,
      users: ['Alex Chen', 'Maria Rodriguez', 'James Wilson']
    },
    {
      id: 2,
      title: 'Top Contributor',
      description: 'Awarded for active participation in community discussions',
      icon: MessageCircle,
      users: ['Dr. Sarah Kim', 'Alex Chen', 'Maria Rodriguez']
    },
    {
      id: 3,
      title: 'Learning Milestone',
      description: 'Completed 10 career development resources',
      icon: BookOpen,
      users: ['James Wilson', 'Alex Chen', 'Dr. Sarah Kim']
    }
  ];

  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Community Hub</h1>
                <p className="mt-2 text-primary-foreground/90">
                  Connect with peers, share experiences, and grow together
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="secondary" className="flex items-center">
                  <Plus size={16} className="mr-2" />
                  Start Discussion
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Community Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center">
                  <Users size={20} className="text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">2,847</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Active Members</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center">
                  <MessageCircle size={20} className="text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">1,204</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Discussions</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar size={20} className="text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">89</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Upcoming Events</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'discussions'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Discussions
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Achievements
                </button>
              </nav>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                {filteredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="border border-border hover:border-primary transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <span className="font-medium">{discussion.author}</span>
                            <span className="mx-2">•</span>
                            <span>{discussion.authorRole}</span>
                            <span className="mx-2">•</span>
                            <span>{discussion.timeAgo}</span>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {discussion.content}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center text-muted-foreground hover:text-primary">
                            <Heart size={16} className="mr-1" />
                            <span>{discussion.likes}</span>
                          </button>
                          <button className="flex items-center text-muted-foreground hover:text-primary">
                            <MessageCircle size={16} className="mr-1" />
                            <span>{discussion.replies} replies</span>
                          </button>
                          <button className="flex items-center text-muted-foreground hover:text-primary">
                            <Share2 size={16} className="mr-1" />
                            <span>Share</span>
                          </button>
                        </div>
                        <Button variant="outline" size="sm">
                          Join Discussion
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="border border-border hover:border-primary transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {event.type}
                          </span>
                          <h3 className="text-lg font-bold text-foreground mt-2">
                            {event.title}
                          </h3>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar size={16} className="mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock size={16} className="mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users size={16} className="mr-2" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {event.description}
                      </p>
                      
                      <Button variant="default" className="w-full">
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card key={achievement.id} className="border border-border hover:border-primary transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                            <IconComponent size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Recent Recipients</h4>
                          <div className="space-y-2">
                            {achievement.users.map((user, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-foreground">
                                    {user.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm text-foreground">{user}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {/* Community Guidelines */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Community Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lightbulb size={16} className="text-primary mr-2" />
                    <span className="font-medium text-foreground">Be Respectful</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Treat all community members with respect and kindness, regardless of their background or experience level.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen size={16} className="text-primary mr-2" />
                    <span className="font-medium text-foreground">Stay On Topic</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep discussions relevant to career development, internships, and professional growth.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users size={16} className="text-primary mr-2" />
                    <span className="font-medium text-foreground">Share Knowledge</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contribute valuable insights and help others in their career journey whenever possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;