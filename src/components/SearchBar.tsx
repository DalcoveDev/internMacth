import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };
  return <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          <input type="text" id="query" placeholder="Job title, skills, or company" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input type="text" id="location" placeholder="City, state, or zip code" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center">
            <SearchIcon size={20} className="mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>;
};
export default SearchBar;