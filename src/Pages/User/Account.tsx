import React from "react";
import Header from "../../components/User/Header";
import AccountSidebar from "../../components/User/AccountSidebar";
import AccountHeader from "../../components/User/AccountHeader";
import Footer from "../../components/User/Footer";
import {TypeAnimation} from 'react-type-animation'
import AntarticaImage from '../../Images/Antartica.jpg'

const Account: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <AccountHeader />
        <div className="w-full bg-slate-200">
          <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
            <div className="bg-white mx-5 mt-5 rounded-lg">
              <AccountSidebar />
            </div>
            <div style={{backgroundImage:`url(${AntarticaImage})`,backgroundSize:'cover' }} className="bg-[url('../../Images/Antartica.jpg')] col-span-2 bg-white mr-5 mt-5 rounded-lg flex justify-center items-center text-2xl uppercase font-[500] ">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
