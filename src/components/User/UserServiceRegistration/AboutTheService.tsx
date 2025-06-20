// AboutTheService.tsx
import { CheckCircle } from 'lucide-react';
import React from 'react';

interface AboutTheServiceProps {
  title?: string;
  points: string[];
}

const AboutTheService: React.FC<AboutTheServiceProps> = ({ title, points }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {title && (
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {title}
        </h2>
      )}
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutTheService;