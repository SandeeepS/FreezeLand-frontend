import { CheckCircle } from 'lucide-react';
import React from 'react'
interface ServiceCardProps {
    title: string;
    points: string[];
  }

const AboutTheService:React.FC<ServiceCardProps> = ({title,points}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md border mr-44 w-full">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    <ul className="space-y-3">
      {points.map((point, index) => (
        <li key={index} className="flex items-center text-gray-700">
          <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
          {point}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default AboutTheService
