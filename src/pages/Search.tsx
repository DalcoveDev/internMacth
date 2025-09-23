import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import InternshipCard, { Internship } from '../components/InternshipCard';
import { FilterIcon, CheckIcon, SearchIcon } from 'lucide-react';
// Sample data for internships
const allInternships = [{
  id: 1,
  title: 'Software Development Intern',
  company: 'Tech Innovations Inc.',
  location: 'San Francisco, CA',
  type: 'Full-time',
  duration: '3 months',
  description: "Join our engineering team to develop cutting-edge web applications using React and Node.js. You'll work directly with senior developers on real projects.",
  requirements: ['React', 'JavaScript', 'Node.js'],
  postedDate: '2 days ago',
  deadline: 'May 30, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 2,
  title: 'Marketing Intern',
  company: 'Global Media Group',
  location: 'New York, NY',
  type: 'Part-time',
  duration: '6 months',
  description: 'Assist our marketing team in developing and implementing digital marketing campaigns. Learn about SEO, content marketing, and social media strategy.',
  requirements: ['Marketing', 'Social Media', 'Content Creation'],
  postedDate: '1 week ago',
  deadline: 'June 15, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 3,
  title: 'Data Science Intern',
  company: 'Analytics Pro',
  location: 'Remote',
  type: 'Full-time',
  duration: '4 months',
  description: 'Work with our data science team to analyze large datasets and build predictive models. Great opportunity to apply machine learning skills in a real-world setting.',
  requirements: ['Python', 'Machine Learning', 'Data Analysis'],
  postedDate: '3 days ago',
  deadline: 'May 25, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 4,
  title: 'UX/UI Design Intern',
  company: 'Creative Solutions',
  location: 'Seattle, WA',
  type: 'Part-time',
  duration: '3 months',
  description: "Join our design team to create user-centered digital experiences. You'll work on wireframes, prototypes, and user testing for web and mobile applications.",
  requirements: ['Figma', 'UI/UX', 'Prototyping'],
  postedDate: '5 days ago',
  deadline: 'June 10, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 5,
  title: 'Business Development Intern',
  company: 'Growth Partners',
  location: 'Chicago, IL',
  type: 'Full-time',
  duration: '6 months',
  description: "Support our business development team in identifying and pursuing new growth opportunities. You'll help with market research, competitive analysis, and client presentations.",
  requirements: ['Business', 'Market Research', 'Communication'],
  postedDate: '1 day ago',
  deadline: 'May 20, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 6,
  title: 'Finance Intern',
  company: 'Global Banking Corp',
  location: 'Boston, MA',
  type: 'Full-time',
  duration: '4 months',
  description: 'Work with our finance team on financial analysis, reporting, and forecasting. Great opportunity for finance students to gain practical experience in a corporate setting.',
  requirements: ['Finance', 'Excel', 'Financial Analysis'],
  postedDate: '1 week ago',
  deadline: 'June 5, 2023',
  logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
}];
const Search = () => {
  const [internships, setInternships] = useState<Internship[]>(allInternships);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    duration: [] as string[]
  });
  const handleSearch = (query: string, location: string) => {
    // In a real app, this would make an API call
    // For now, we'll just filter the sample data
    let filtered = [...allInternships];
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
                  <input id="full-time" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.type.includes('Full-time')} onChange={() => toggleFilter('type', 'Full-time')} />
                  <label htmlFor="full-time" className="ml-2 text-sm text-gray-700">
                    Full-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="part-time" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.type.includes('Part-time')} onChange={() => toggleFilter('type', 'Part-time')} />
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
                  <input id="3-months" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('3 months')} onChange={() => toggleFilter('duration', '3 months')} />
                  <label htmlFor="3-months" className="ml-2 text-sm text-gray-700">
                    3 months
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="4-months" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('4 months')} onChange={() => toggleFilter('duration', '4 months')} />
                  <label htmlFor="4-months" className="ml-2 text-sm text-gray-700">
                    4 months
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="6-months" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('6 months')} onChange={() => toggleFilter('duration', '6 months')} />
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
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon size={16} className="mr-2" />
            Filters
          </button>
          {isFilterOpen && <div className="mt-2 bg-white p-4 rounded-lg shadow-md">
              <div className="mb-6">
                <h3 className="font-medium mb-2">Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input id="full-time-mobile" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.type.includes('Full-time')} onChange={() => toggleFilter('type', 'Full-time')} />
                    <label htmlFor="full-time-mobile" className="ml-2 text-sm text-gray-700">
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="part-time-mobile" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.type.includes('Part-time')} onChange={() => toggleFilter('type', 'Part-time')} />
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
                    <input id="3-months-mobile" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('3 months')} onChange={() => toggleFilter('duration', '3 months')} />
                    <label htmlFor="3-months-mobile" className="ml-2 text-sm text-gray-700">
                      3 months
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="4-months-mobile" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('4 months')} onChange={() => toggleFilter('duration', '4 months')} />
                    <label htmlFor="4-months-mobile" className="ml-2 text-sm text-gray-700">
                      4 months
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="6-months-mobile" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={filters.duration.includes('6 months')} onChange={() => toggleFilter('duration', '6 months')} />
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
              {internships.map(internship => <InternshipCard key={internship.id} internship={internship} />)}
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