import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import InternshipCard from '../components/InternshipCard';
import { listInternships } from '../api';
;
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
import { FilterIcon, SearchIcon } from 'lucide-react';
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
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Find Your Perfect Internship
      </h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-8 flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Type</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="full-time" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.type.includes('Full-time')} onChange={() => toggleFilter('type', 'Full-time')} />
                  <label htmlFor="full-time" className="ml-2 text-sm text-gray-700">
                    Full-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="part-time" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.type.includes('Part-time')} onChange={() => toggleFilter('type', 'Part-time')} />
                  <label htmlFor="part-time" className="ml-2 text-sm text-gray-700">
                    Part-time
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Duration</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="3-months" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('3 months')} onChange={() => toggleFilter('duration', '3 months')} />
                  <label htmlFor="3-months" className="ml-2 text-sm text-gray-700">
                    3 months
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="4-months" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('4 months')} onChange={() => toggleFilter('duration', '4 months')} />
                  <label htmlFor="4-months" className="ml-2 text-sm text-gray-700">
                    4 months
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="6-months" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('6 months')} onChange={() => toggleFilter('duration', '6 months')} />
                  <label htmlFor="6-months" className="ml-2 text-sm text-gray-700">
                    6 months
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filters button - Mobile */}
        <div className="md:hidden mb-4">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-emerald-50/70">
            <FilterIcon size={16} className="mr-2" />
            Filters
          </button>
          {isFilterOpen && <div className="mt-2 bg-white p-4 rounded-lg shadow-md">
              <div className="mb-6">
                <h3 className="font-medium mb-2">Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input id="full-time-mobile" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.type.includes('Full-time')} onChange={() => toggleFilter('type', 'Full-time')} />
                    <label htmlFor="full-time-mobile" className="ml-2 text-sm text-gray-700">
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="part-time-mobile" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.type.includes('Part-time')} onChange={() => toggleFilter('type', 'Part-time')} />
                    <label htmlFor="part-time-mobile" className="ml-2 text-sm text-gray-700">
                      Part-time
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Duration</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input id="3-months-mobile" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('3 months')} onChange={() => toggleFilter('duration', '3 months')} />
                    <label htmlFor="3-months-mobile" className="ml-2 text-sm text-gray-700">
                      3 months
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="4-months-mobile" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('4 months')} onChange={() => toggleFilter('duration', '4 months')} />
                    <label htmlFor="4-months-mobile" className="ml-2 text-sm text-gray-700">
                      4 months
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="6-months-mobile" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" checked={filters.duration.includes('6 months')} onChange={() => toggleFilter('duration', '6 months')} />
                    <label htmlFor="6-months-mobile" className="ml-2 text-sm text-gray-700">
                      6 months
                    </label>
                  </div>
                </div>
              </div>
            </div>}
        </div>
        {/* Search Results */}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {internships.length}{' '}
              {internships.length === 1 ? 'Result' : 'Results'}
            </h2>
          </div>
          {internships.length > 0 ? <div className="space-y-6">
              {internships.map(internship => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div> : <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <SearchIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No internships found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search filters or try a different location.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Search;