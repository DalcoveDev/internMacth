import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import InternshipCard from '../components/InternshipCard';
import { listInternships } from '../api';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    duration: [] as string[]
  });

  const handleSearch = (query: string, location: string) => {
    let filtered = [...internships];
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(internship => internship.title.toLowerCase().includes(lowerQuery) || internship.company.toLowerCase().includes(lowerQuery) || internship.description.toLowerCase().includes(lowerQuery));
    }
    if (location) {
      const lowerLocation = location.toLowerCase();
      filtered = filtered.filter(internship => internship.location.toLowerCase().includes(lowerLocation));
    }
    // Apply additional filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(internship => filters.type.includes(internship.type));
    }
    if (filters.duration.length > 0) {
      filtered = filtered.filter(internship => filters.duration.includes(internship.duration));
    }
    setInternships(filtered);
  };

  const toggleFilter = (category: 'type' | 'duration', value: string) => {
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
  };

  // Apply filters when they change
  useEffect(() => {
    handleSearch('', '');
  }, [filters]);

  // Load from API on mount
  useEffect(() => {
    listInternships().then((data: any[]) => {
      const mapped = data.map(d => ({
        id: d.id,
        title: d.title,
        company: d.company,
        location: d.location ?? 'Remote',
        type: 'Full-time',
        duration: '3 months',
        description: d.description ?? '',
        requirements: (d.skills || '').split(',').map((s: string) => s.trim()),
        postedDate: d.createdAt ?? '',
        deadline: '',
        logoUrl: ''
      }))
      setInternships(mapped)
    }).catch(() => {
      setInternships([])
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/Daily 3D renders — abstract cloth edition.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Internship</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="mt-12 flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
                
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Internship Type</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        id="full-time" 
                        type="checkbox" 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        checked={filters.type.includes('Full-time')} 
                        onChange={() => toggleFilter('type', 'Full-time')} 
                      />
                      <label htmlFor="full-time" className="ml-3 text-gray-700">
                        Full-time
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="part-time" 
                        type="checkbox" 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        checked={filters.type.includes('Part-time')} 
                        onChange={() => toggleFilter('type', 'Part-time')} 
                      />
                      <label htmlFor="part-time" className="ml-3 text-gray-700">
                        Part-time
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Duration</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        id="3-months" 
                        type="checkbox" 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        checked={filters.duration.includes('3 months')} 
                        onChange={() => toggleFilter('duration', '3 months')} 
                      />
                      <label htmlFor="3-months" className="ml-3 text-gray-700">
                        3 months
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="4-months" 
                        type="checkbox" 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        checked={filters.duration.includes('4 months')} 
                        onChange={() => toggleFilter('duration', '4 months')} 
                      />
                      <label htmlFor="4-months" className="ml-3 text-gray-700">
                        4 months
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="6-months" 
                        type="checkbox" 
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                        checked={filters.duration.includes('6 months')} 
                        onChange={() => toggleFilter('duration', '6 months')} 
                      />
                      <label htmlFor="6-months" className="ml-3 text-gray-700">
                        6 months
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FilterIcon size={16} className="mr-2" />
                Filters
              </button>
              
              {isFilterOpen && (
                <div className="mt-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Internship Type</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="full-time-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                          checked={filters.type.includes('Full-time')} 
                          onChange={() => toggleFilter('type', 'Full-time')} 
                        />
                        <label htmlFor="full-time-mobile" className="ml-3 text-gray-700">
                          Full-time
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="part-time-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                          checked={filters.type.includes('Part-time')} 
                          onChange={() => toggleFilter('type', 'Part-time')} 
                        />
                        <label htmlFor="part-time-mobile" className="ml-3 text-gray-700">
                          Part-time
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Duration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          id="3-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                          checked={filters.duration.includes('3 months')} 
                          onChange={() => toggleFilter('duration', '3 months')} 
                        />
                        <label htmlFor="3-months-mobile" className="ml-3 text-gray-700">
                          3 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="4-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                          checked={filters.duration.includes('4 months')} 
                          onChange={() => toggleFilter('duration', '4 months')} 
                        />
                        <label htmlFor="4-months-mobile" className="ml-3 text-gray-700">
                          4 months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="6-months-mobile" 
                          type="checkbox" 
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                          checked={filters.duration.includes('6 months')} 
                          onChange={() => toggleFilter('duration', '6 months')} 
                        />
                        <label htmlFor="6-months-mobile" className="ml-3 text-gray-700">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {internships.length} {internships.length === 1 ? 'Result' : 'Results'}
                </h2>
              </div>
              
              {internships.length > 0 ? (
                <div className="space-y-6">
                  {internships.map(internship => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-6">
                    <SearchIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No internships found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search filters or try a different location.
                  </p>
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