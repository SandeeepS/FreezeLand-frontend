import React from "react";
import { FaFortAwesome } from "react-icons/fa";
import { GiShipBow, GiByzantinTemple } from "react-icons/gi";
import { PopularCitiesProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";

const PopularCities: React.FC<PopularCitiesProps> = ({ onCityClick }) => {
  // Object to store city names as keys and icons as values
  const popularCities = {
    Bengaluru: <FaFortAwesome className="text-4xl text-blue-500" />,
    Kochi: <GiShipBow className="text-4xl text-green-500" />,
    Trivandrum: <GiByzantinTemple className="text-4xl text-yellow-500" />,
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Location Clicked");
    const target = event.target as HTMLElement;

    const card = target.closest<HTMLDivElement>("[data-city]");
    if (card) {
      const city = card.getAttribute("data-city");
      console.log("Location Clicked:", city);
      localStorage.setItem("Location", city as string);
      onCityClick();
    }
  };

  return (
    <div
      className="MainDiv grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6"
      onClick={handleClick}
    >
      {Object.entries(popularCities).map(([city, icon]) => (
        <div
          key={city}
          data-city={city}
          className="cursor-pointer flex flex-col hover:scale-105 items-center justify-center bg-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 "
        >
          <div className="icon mb-4">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-700">{city}</h3>
        </div>
      ))}
    </div>
  );
};

export default PopularCities;
