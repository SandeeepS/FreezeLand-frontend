import React from "react";
import { LocationModalProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";
// import SearchBar from "./SearchBar";
import PopularCities from "./PopularCities";

const LocationModal: React.FC<LocationModalProps> = ({ onClose, userId }) => {
  return (
    <div className="outerDiv flex flex-col items-center justify-center shadow-2xl bg-opacity-50 min-h-screen p-4">
      <div className="innerDiv bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[70vh] max-h-[90vh] backdrop-blur-xs rounded-lg overflow-hidden">
        
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold uppercase leading-tight">
            Select your location to continue
          </h1>
        </div>
        
        {/* <div className="SearchBar px-4 sm:px-6 md:px-8">
          <SearchBar/>
        </div> */}
        
        {/* Sub Heading Section */}
        <div className="SubHeading flex flex-col items-center mt-6 sm:mt-8 md:mt-10 font-exo font-bold px-4">
          <h1 className="uppercase text-sm sm:text-base md:text-lg">
            Popular Cities
          </h1>
        </div>
        
        <div className="PopularCities mt-6 sm:mt-8 md:mt-12 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 overflow-y-auto flex-1">
          <PopularCities onCityClick={onClose} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default LocationModal;