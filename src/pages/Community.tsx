import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Trophy, 
  BookOpen, 
  ArrowLeft,
  Search,
  Plus,
  Heart,
  MoreHorizontal,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { communityAPI } from '@/lib/new-api-client';

// Define types for our community data
interface Discussion {
  id: number;
  title: string;
  author: string;
  authorRole: string;
  replies: number;
  likes: number;
  tags: string[];
  timeAgo: string;
  content: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
  description: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  users: string[];
}

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discussionsLoading, setDiscussionsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  // Icon mapping
  const iconMap: Record<string, any> = {
    Trophy,
    MessageCircle,
    BookOpen
  };

  // Fetch community data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all community data in parallel
        const [discussionsResponse, eventsResponse, achievementsResponse] = await Promise.all([
          communityAPI.getDiscussions(),
          communityAPI.getEvents(),
          communityAPI.getAchievements()
        ]);
        
        setDiscussions(discussionsResponse.data.data);
        setEvents(eventsResponse.data.data);
        setAchievements(achievementsResponse.data.data);
      } catch (err: any) {
        console.error('Failed to fetch community data:', err);
        setError('Failed to load community data. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load community data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh discussions
  const refreshDiscussions = async () => {
    try {
      setDiscussionsLoading(true);
      const response = await communityAPI.getDiscussions();
      setDiscussions(response.data.data);
    } catch (err: any) {
      console.error('Failed to refresh discussions:', err);
      toast({
        title: "Error",
        description: "Failed to refresh discussions.",
        variant: "destructive",
      });
    } finally {
      setDiscussionsLoading(false);
    }
  };

  // Refresh events
  const refreshEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await communityAPI.getEvents();
      setEvents(response.data.data);
    } catch (err: any) {
      console.error('Failed to refresh events:', err);
      toast({
        title: "Error",
        description: "Failed to refresh events.",
        variant: "destructive",
      });
    } finally {
      setEventsLoading(false);
    }
  };

  // Refresh achievements
  const refreshAchievements = async () => {
    try {
      setAchievementsLoading(true);
      const response = await communityAPI.getAchievements();
      setAchievements(response.data.data);
    } catch (err: any) {
      console.error('Failed to refresh achievements:', err);
      toast({
        title: "Error",
        description: "Failed to refresh achievements.",
        variant: "destructive",
      });
    } finally {
      setAchievementsLoading(false);
    }
  };

  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
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
          Back
        </Button>
        
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <h1 className="text-3xl font-bold">Community Hub</h1>
            <p className="mt-2 text-primary-foreground/90">
              Connect with peers, participate in events, and celebrate achievements
            </p>
          </div>
          
          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search discussions, events, or achievements..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-ring focus:border-ring focus:ring-2 transition-all bg-background text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'discussions' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('discussions');
                    refreshDiscussions();
                  }}
                  className="flex items-center"
                  disabled={discussionsLoading}
                >
                  {discussionsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MessageCircle size={16} className="mr-2" />
                  )}
                  Discussions
                </Button>
                <Button 
                  variant={activeTab === 'events' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('events');
                    refreshEvents();
                  }}
                  className="flex items-center"
                  disabled={eventsLoading}
                >
                  {eventsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar size={16} className="mr-2" />
                  )}
                  Events
                </Button>
                <Button 
                  variant={activeTab === 'achievements' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('achievements');
                    refreshAchievements();
                  }}
                  className="flex items-center"
                  disabled={achievementsLoading}
                >
                  {achievementsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trophy size={16} className="mr-2" />
                  )}
                  Achievements
                </Button>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'discussions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Recent Discussions</h2>
                  <Button className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    New Discussion
                  </Button>
                </div>
                
                {discussionsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredDiscussions.length > 0 ? (
                  <div className="space-y-6">
                    {filteredDiscussions.map(discussion => (
                      <Card key={discussion.id} className="border border-border hover:border-primary transition-colors">
                        <CardContent className="p-6">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-foreground mb-2">{discussion.title}</h3>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </div>
                          <p className="text-muted-foreground mb-4">{discussion.content}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-foreground">{discussion.author}</p>
                                <p className="text-xs text-muted-foreground">{discussion.authorRole}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MessageCircle size={16} className="mr-1" />
                                {discussion.replies}
                              </div>
                              <div className="flex items-center">
                                <Heart size={16} className="mr-1" />
                                {discussion.likes}
                              </div>
                              <div className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                {discussion.timeAgo}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No discussions found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or start a new discussion.</p>
                    <Button className="flex items-center mx-auto">
                      <Plus size={16} className="mr-2" />
                      Start a Discussion
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                  <Button className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Event
                  </Button>
                </div>
                
                {eventsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                      <Card key={event.id} className="border border-border hover:border-primary transition-colors">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                {event.type}
                              </span>
                              <h3 className="text-lg font-bold text-foreground mt-2">{event.title}</h3>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar size={16} className="mr-2" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock size={16} className="mr-2" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin size={16} className="mr-2" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-muted-foreground">
                              <Users size={16} className="mr-2" />
                              <span>{event.attendees} attending</span>
                            </div>
                            <Button size="sm">Join Event</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or add a new event.</p>
                    <Button className="flex items-center mx-auto">
                      <Plus size={16} className="mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Community Achievements</h2>
                </div>
                
                {achievementsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map(achievement => {
                      const IconComponent = iconMap[achievement.icon] || Trophy;
                      return (
                        <Card key={achievement.id} className="border border-border hover:border-primary transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3 mr-4">
                                <IconComponent size={24} className="text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-foreground">{achievement.title}</h3>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">Recent Recipients:</h4>
                              <div className="flex flex-wrap gap-2">
                                {achievement.users.map(user => (
                                  <span key={user} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                                    {user}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No achievements found</h3>
                    <p className="text-muted-foreground">Check back later for community achievements.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;