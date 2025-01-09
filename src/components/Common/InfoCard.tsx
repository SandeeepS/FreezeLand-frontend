import React from 'react'

const InfoCard:React.FC = () => {
  return (
    <div
        className="transform  rounded-xl h-24 w-64 bg-white shadow-xl transition duration-300 hover:scale-105">
        <div className="flex h-full justify-center items-center">
            <span className="font-bold text-gray-500">Scale</span>
        </div>
    </div>
  )
}

export default InfoCard
