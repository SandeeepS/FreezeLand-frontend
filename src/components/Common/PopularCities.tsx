import React  from "react";
import { FaFortAwesome } from "react-icons/fa";
import { GiShipBow, GiByzantinTemple } from "react-icons/gi";
import { PopularCitiesProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { updateUserLocation } from "../../Api/user";

export  interface LocationData {
  type: {
    type: string;
    enum: string[];
    default: string;
  };
  coordinates: number[]; // [longitude, latitude]
  city: string;
  state: string;
}

const PopularCities: React.FC<PopularCitiesProps> = ({ onCityClick ,userId}) => {
  // City data with coordinates and state information
  const cityData = {
    Bengaluru: {
      coordinates: [77.5946, 12.9716], // [longitude, latitude]
      state: "Karnataka"
    },
    Kochi: {
      coordinates: [76.2673, 9.9312],
      state: "Kerala"
    },
    Trivandrum: {
      coordinates: [76.9366, 8.5241],
      state: "Kerala"
    }
  };

  // Object to store city names as keys and icons as values
  const popularCities = {
    Bengaluru: <FaFortAwesome className="text-4xl text-blue-500" />,
    Kochi: <GiShipBow className="text-4xl text-green-500" />,
    Trivandrum: <GiByzantinTemple className="text-4xl text-yellow-500" />,
  };

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Location Clicked");
    const target = event.target as HTMLElement;

    const card = target.closest<HTMLDivElement>("[data-city]");
    if (card) {
      const city = card.getAttribute("data-city");
      console.log("Location Clicked:", city);
      
      if (city && city in cityData) {
        // Create location object based on schema
        const locationData: LocationData = {
          type: {
            type: "Point",
            enum: ["Point"],
            default: "Point"
          },
          coordinates: cityData[city as keyof typeof cityData].coordinates,
          city: city,
          state: cityData[city as keyof typeof cityData].state
        };

        console.log("Location data to be sent:", locationData);
        
        try {
          // Save to localStorage
          localStorage.setItem("Location", city);
          localStorage.setItem("LocationData", JSON.stringify(locationData));
          
          const result = await updateUserLocation(userId,locationData);
          console.log("Result afte updating the userLocation from the backEnd in the popularCities is ",result);
          onCityClick( );
        } catch (error) {
          console.error("Error sending location data to backend:", error);
        }
      }
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