import React from 'react';
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
  onApply?: (internship: Internship) => void;
}
const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onApply
}) => {
  return <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-gray-100">
      <div className="flex items-start">
        <div className="h-16 w-16 flex-shrink-0 mr-4">
          <img src={internship.logoUrl} alt={`${internship.company} logo`} className="h-full w-full object-contain rounded-md" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {internship.title}
          </h3>
          <div className="flex items-center text-gray-600 mt-1">
            <BuildingIcon size={16} className="mr-1" />
            <span>{internship.company}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPinIcon size={16} className="mr-1" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <CalendarIcon size={16} className="mr-1" />
            <span>{internship.duration}</span>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            {internship.type}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 line-clamp-3">{internship.description}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted: {internship.postedDate}
        </div>
        <button onClick={() => onApply && onApply(internship)} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors">
          Apply Now
        </button>
      </div>
    </div>;
};
export default InternshipCard;