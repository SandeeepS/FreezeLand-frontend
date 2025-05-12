import React from "react";
import { LocationModalProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import SearchBar from "./SearchBar";
import PopularCities from "./PopularCities";



const LocationModal:React.FC<LocationModalProps> = ({onClose}) => {
  return (
    <div className="outerDiv flex flex-col items-center  shadow-2xl  bg-opacity-50 h-screen">
      <div className="innerDiv bg-white w-[90%] sm:w-[75%] md:w-[60%] lg:w-[50%] xl:w-[45%] h-[80%] mt-14 backdrop-blur-xs rounded-lg p-4">
        <div>
          <h1 className=" text-center text-lg md:text-xl lg:text-xl font-semibold uppercase">
            Select you location to continue 
          </h1>
        </div>
        <div className="SearchBar mt-10">
            <SearchBar/>
        </div>
        <div className="SubHeading flex flex-col items-center mt-10 font-exo font-bold">
            <h1 className="uppercase">popular cities</h1>
        </div>
        <div className="PopularCities mt-12">
                <PopularCities onCityClick={onClose}/>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
