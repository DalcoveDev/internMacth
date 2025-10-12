import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, BuildingIcon } from 'lucide-react';

export interface Internship {
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

interface InternshipCardProps {
  internship: Internship;
}

// Lazy loading for images
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      ) : null}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'block' : 'hidden'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
};

const InternshipCard: React.FC<InternshipCardProps> = memo(({
  internship
}) => {
  const navigate = useNavigate();
  
  const handleApply = () => {
    // Navigate to application form instead of direct submission
    navigate(`/apply/${internship.id}`);
  };
  
  return (
    <div className="bg-card rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-border relative overflow-hidden">
      {/* Decorative element for the card */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full"></div>
      <div className="relative z-10">
        <div className="flex items-start">
          <div className="h-16 w-16 flex-shrink-0 mr-4">
            <LazyImage 
              src={internship.logoUrl} 
              alt={`${internship.company} logo`} 
              className="h-full w-full object-contain rounded-md" 
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {internship.title}
            </h3>
            <div className="flex items-center text-muted-foreground mt-1">
              <BuildingIcon size={16} className="mr-1" />
              <span>{internship.company}</span>
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPinIcon size={16} className="mr-1" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <CalendarIcon size={16} className="mr-1" />
              <span>{internship.duration}</span>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {internship.type}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-muted-foreground line-clamp-3">{internship.description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Posted: {internship.postedDate}
          </div>
          <button 
            onClick={handleApply} 
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
});

export default InternshipCard;