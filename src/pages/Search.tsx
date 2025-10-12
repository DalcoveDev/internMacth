import { useEffect, useState, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import InternshipCard from '../components/InternshipCard';
import { FilterIcon, SearchIcon } from 'lucide-react';

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  logoUrl: string;
}

const Search = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    duration: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  // Generate mock internships data
  const generateMockInternships = (): Internship[] => {
    return [
      {
        id: 1,
        title: 'Software Development Intern',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        duration: '3 months',
        description: "Join our engineering team to develop cutting-edge web applications using React and Node.js. You'll work directly with senior developers on real projects.",
        requirements: ['React', 'JavaScript', 'Node.js'],
        postedDate: '2023-05-15',
        deadline: '2023-06-30',
        logoUrl: 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 2,
        title: 'Marketing Intern',
        company: 'Global Media Group',
        location: 'New York, NY',
        type: 'Part-time',
        duration: '6 months',
        description: 'Assist our marketing team in developing and implementing digital marketing campaigns. Learn about SEO, content marketing, and social media strategy.',
        requirements: ['Marketing', 'Social Media', 'Content Creation'],
        postedDate: '2023-05-10',
        deadline: '2023-07-15',
        logoUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 3,
        title: 'Data Science Intern',
        company: 'Analytics Pro',
        location: 'Remote',
        type: 'Full-time',
        duration: '4 months',
        description: 'Work with our data science team to analyze large datasets and build predictive models. Great opportunity to apply machine learning skills in a real-world setting.',
        requirements: ['Python', 'Machine Learning', 'Data Analysis'],
        postedDate: '2023-05-05',
        deadline: '2023-06-25',
        logoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 4,
        title: 'Graphic Design Intern',
        company: 'Creative Studios',
        location: 'Los Angeles, CA',
        type: 'Part-time',
        duration: '3 months',
        description: 'Work with our creative team to design marketing materials, social media content, and brand assets. Experience with Adobe Creative Suite required.',
        requirements: ['Adobe Photoshop', 'Illustrator', 'Design Principles'],
        postedDate: '2023-05-12',
        deadline: '2023-06-28',
        logoUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 5,
        title: 'Finance Intern',
        company: 'Global Financial Services',
        location: 'Chicago, IL',
        type: 'Full-time',
        duration: '3 months',
        description: 'Support our finance team with financial analysis, reporting, and modeling. Great opportunity to learn about investment banking and corporate finance.',
        requirements: ['Excel', 'Financial Modeling', 'Analytical Skills'],
        postedDate: '2023-05-08',
        deadline: '2023-06-22',
        logoUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      }
    ];
  };

  const handleSearch = useCallback((query: string, location: string) => {
    let filtered = [...allInternships];
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(internship => 
        internship.title.toLowerCase().includes(lowerQuery) || 
        internship.company.toLowerCase().includes(lowerQuery) || 
        internship.description.toLowerCase().includes(lowerQuery)
      );
    }
    if (location) {
      const lowerLocation = location.toLowerCase();
      filtered = filtered.filter(internship => 
        internship.location.toLowerCase().includes(lowerLocation)
      );
    }
    // Apply additional filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(internship => 
        filters.type.includes(internship.type)
      );
    }
    if (filters.duration.length > 0) {
      filtered = filtered.filter(internship => 
        filters.duration.includes(internship.duration)
      );
    }
    setInternships(filtered);
  }, [allInternships, filters]);

  const toggleFilter = useCallback((category: 'type' | 'duration', value: string) => {
    setFilters(prev => {
      const current = [...prev[category]];
      const index = current.indexOf(value);
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      return {
        ...prev,
        [category]: current
      };
    });
  }, []);

  // Apply filters when they change
  useEffect(() => {
    handleSearch('', '');
  }, [filters, handleSearch]);

  // Initialize with mock data
  useEffect(() => {
    const initializeData = () => {
      try {
        setLoading(true);
        const mockData = generateMockInternships();
        setAllInternships(mockData);
        setInternships(mockData);
      } catch (error) {
        console.error('Failed to initialize internships:', error);
        setAllInternships([]);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Memoize the internship list to prevent unnecessary re-renders
  const internshipList = useMemo(() => internships, [internships]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
      ></div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 rounded-lg bg-primary/20 backdrop-blur-sm rotate-45"></div>
      </div>
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden">
        {/* Background Image with enhanced effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url('/images/new.jpeg')` }}
        ></div>
        {/* Additional decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Internship</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="mt-12 flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-border relative overflow-hidden">
                {/* Decorative element for the filter card */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-foreground mb-6">Filters</h2>
                  
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4">Internship Type</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="full-time" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.type.includes('Full-time')} 
                          onChange={() => toggleFilter('type', 'Full-time')} 
                        />
                        <label htmlFor="full-time" className="ml-3 text-foreground">
                          Full-time
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="part-time" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.type.includes('Part-time')} 
                          onChange={() => toggleFilter('type', 'Part-time')} 
                        />
                        <label htmlFor="part-time" className="ml-3 text-foreground">
                          Part-time
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Duration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="3-months" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('3 months')} 
                          onChange={() => toggleFilter('duration', '3 months')} 
                        />
                        <label htmlFor="3-months" className="ml-3 text-foreground">
                          3 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="4-months" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('4 months')} 
                          onChange={() => toggleFilter('duration', '4 months')} 
                        />
                        <label htmlFor="4-months" className="ml-3 text-foreground">
                          4 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="6-months" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('6 months')} 
                          onChange={() => toggleFilter('duration', '6 months')} 
                        />
                        <label htmlFor="6-months" className="ml-3 text-foreground">
                          6 months
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="flex items-center px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent shadow-sm"
              >
                <FilterIcon size={16} className="mr-2" />
                Filters
              </button>
              
              {isFilterOpen && (
                <div className="mt-4 bg-card rounded-xl shadow-sm p-6 border border-border">
                  <h2 className="text-lg font-bold text-foreground mb-4">Filters</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Internship Type</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="full-time-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.type.includes('Full-time')} 
                          onChange={() => toggleFilter('type', 'Full-time')} 
                        />
                        <label htmlFor="full-time-mobile" className="ml-3 text-foreground">
                          Full-time
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="part-time-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.type.includes('Part-time')} 
                          onChange={() => toggleFilter('type', 'Part-time')} 
                        />
                        <label htmlFor="part-time-mobile" className="ml-3 text-foreground">
                          Part-time
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Duration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="3-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('3 months')} 
                          onChange={() => toggleFilter('duration', '3 months')} 
                        />
                        <label htmlFor="3-months-mobile" className="ml-3 text-foreground">
                          3 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="4-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('4 months')} 
                          onChange={() => toggleFilter('duration', '4 months')} 
                        />
                        <label htmlFor="4-months-mobile" className="ml-3 text-foreground">
                          4 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="6-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card" 
                          checked={filters.duration.includes('6 months')} 
                          onChange={() => toggleFilter('duration', '6 months')} 
                        />
                        <label htmlFor="6-months-mobile" className="ml-3 text-foreground">
                          6 months
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {internshipList.length} {internshipList.length === 1 ? 'Result' : 'Results'}
                </h2>
              </div>
              
              {internshipList.length > 0 ? (
                <div className="space-y-6">
                  {internshipList.map(internship => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl shadow-sm p-12 text-center border border-border relative overflow-hidden">
                  {/* Decorative element for the empty state card */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent text-muted-foreground mb-6">
                      <SearchIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      No internships found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your search filters or try a different location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;