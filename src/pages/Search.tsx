import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import InternshipCard from '../components/InternshipCard';
import { FilterIcon, SearchIcon } from 'lucide-react';
// Import the real API client
import { internshipsAPI } from '@/lib/new-api-client';
import { useToast } from '@/hooks/use-toast';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const Search = () => {
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    duration: [] as string[]
  });
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  // Helper functions for showing toast notifications
  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };

  const handleSearch = useCallback((query: string, location: string) => {
    setSearchParams({ query, location });
    // Reset to first page when search changes
    fetchInternships(1, query, location);
  }, []);

  const fetchInternships = useCallback(async (page: number = 1, searchQuery: string = searchParams.query, locationQuery: string = searchParams.location) => {
    try {
      setLoading(true);
      
      // Prepare API parameters
      const params: any = {
        page,
        limit: pagination.limit
      };
      
      // Add search parameters if they exist
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (locationQuery) {
        params.location = locationQuery;
      }
      
      // Add filter parameters if they exist
      if (filters.type.length > 0) {
        // Map frontend filter values to backend expected values
        const backendTypes = filters.type.map(type => {
          switch (type) {
            case 'Full-time': return 'full-time';
            case 'Part-time': return 'part-time';
            default: return type.toLowerCase();
          }
        });
        params.type = backendTypes.join(',');
      }
      
      const response = await internshipsAPI.getAll(params);
      const internshipsData = response.data.data?.internships || [];
      const paginationData = response.data.data?.pagination || {};
      
      const transformedInternships: Internship[] = internshipsData.map((internship: any) => ({
        id: internship.id,
        title: internship.title,
        company: internship.company_name || 'Unknown Company',
        location: internship.location,
        type: internship.type,
        duration: internship.duration,
        description: internship.description,
        requirements: internship.requirements ? internship.requirements.split(',').map((req: string) => req.trim()) : [],
        postedDate: internship.created_at,
        deadline: internship.deadline,
        logoUrl: internship.logo || 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      }));
      
      setInternships(transformedInternships);
      setPagination({
        page: paginationData.page || 1,
        limit: paginationData.limit || 10,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0,
        hasNext: paginationData.hasNext || false,
        hasPrev: paginationData.hasPrev || false
      });
    } catch (error: any) {
      console.error('Failed to fetch internships:', error);
      let errorMessage = 'Failed to load internships. Please try again later.';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams, pagination.limit]);

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
    fetchInternships(1);
  }, [filters, fetchInternships]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchInternships(newPage);
  };

  // Initialize with real data
  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  // Memoize the internship list to prevent unnecessary re-renders
  const internshipList = useMemo(() => internships, [internships]);

  if (loading && internships.length === 0) {
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
                  {pagination.total} {pagination.total === 1 ? 'Result' : 'Results'}
                </h2>
              </div>
              
              {internshipList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {internshipList.map(internship => (
                      <InternshipCard key={internship.id} internship={internship} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrev}
                          className={`px-4 py-2 rounded-md ${
                            pagination.hasPrev 
                              ? 'bg-card text-foreground hover:bg-accent' 
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          Previous
                        </button>
                        
                        <span className="px-4 py-2 text-foreground">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNext}
                          className={`px-4 py-2 rounded-md ${
                            pagination.hasNext 
                              ? 'bg-card text-foreground hover:bg-accent' 
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-card rounded-xl shadow-sm p-12 text-center border border-border relative overflow-hidden">
                  {/* Decorative element for the empty state card */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent text-muted-foreground mb-6">
                      <SearchIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      No approved internships available
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      There are currently no internships available. Please check back later as new opportunities are added regularly.
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm">
                      If you're a company looking to post an internship, <Link to="/post-internship" className="text-primary hover:underline">click here</Link>.
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