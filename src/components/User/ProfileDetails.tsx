import React from 'react';
import { TypeAnimation } from "react-type-animation";
import AntarticaImage from "../../Images/Antartica.jpg";


const ProfileDetails = () => {
  return (
    <div
    style={{
      backgroundImage: `url(${AntarticaImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center", 
      width: "100%", 
      height: "100%", 
    }}
    className=" col-span-2 bg-white rounded-lg flex justify-center items-center text-2xl uppercase font-[500] "
  >
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        "Welcome Sandeep",
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        "Welcome to the Account Session",
        1000,
        // "",
        // 1000,
        // "We produce food for Chinchillas",
        // 1000,
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: "2em", display: "inline-block" }}
      repeat={Infinity}
    />
  </div>
  )
}

export default ProfileDetails
