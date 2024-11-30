import React from "react";

const WhyChooseUs: React.FC = () => {
  return (
    <div >
      <div className="bg-slate-100 flex flex-col ">
        <div className="flex items-center justify-center pt-10">
          <h1 className="font-bold text-5xl">Why Choose US?</h1>
        </div>

        <div className=" items-center justify-center text-center italic mt-5">
          <p>
            As a prominent name in the repair industry, we provide best-in-class
            AC repair and service with our highly-skilled
          </p>
          <p>technicians, quality parts, and latest tools & technologies</p>
        </div>

        <div className="flex m-14  flex-col md:flex-row md:items-center md:justify-center">
          <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/src/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </div>

          <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/src/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </div>

          <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src="/src/Images/certified tech.png"
                alt="Example image"
                className="w-full h-auto"
              />
            </div>

            <div className="px-6 py-4 text-center">
              <div className="font-bold text-xl mb-2 italic">
                Certified Technicians
              </div>
              <p className="text-gray-700 text-base">
                All AC technicians at Carlcare are certified and well-trained
                who are proficient to repair your AC impeccably
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
