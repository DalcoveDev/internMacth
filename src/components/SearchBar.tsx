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

  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-border relative overflow-hidden">
      {/* Decorative element for the search bar */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full"></div>
      <div className="relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="query" className="block text-sm font-medium text-foreground mb-1">
              Keywords
            </label>
            <input 
              type="text" 
              id="query" 
              placeholder="Job title, skills, or company" 
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-ring focus:ring-2 transition-all bg-background text-foreground placeholder:text-muted-foreground" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
              Location
            </label>
            <input 
              type="text" 
              id="location" 
              placeholder="City, state, or zip code" 
              className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-ring focus:ring-2 transition-all bg-background text-foreground placeholder:text-muted-foreground" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <SearchIcon size={20} className="mr-2" />
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;