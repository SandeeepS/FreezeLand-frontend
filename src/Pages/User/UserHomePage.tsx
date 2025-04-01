import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/User/Header";
import CarousalComponent from "../../components/User/CarousalComponent";
import Promo1 from "../../components/User/SubContentHomepage";
import ServiceList from "../../components/User/ServiceList";
import Promo2 from "../../components/User/WhyChooseUs";
import Footer from "../../components/User/Footer";
import LocationModal from "../../components/Common/LocationModal";

const slides = [
  {
    image: "/src/Images/acWall1.jpg",
    text1: "Our vision   ",
    text2: "is to provide the",
    text3: "best service to",
    text4: "our customers.",
  },
  {
    image: "/src/Images/acWall2.jpg",
    text1: "We strive ",
    text2: "for excellence",
    text3: " in everything ",
    text4: "we do.",
  },
];

const UserHomePage: React.FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Show the LocationModal after 2 seconds
  useEffect(() => {
    const location = localStorage.getItem("Location");
    console.log("Location already exists",location);
    if(!location){
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 2000);
  
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  
  }, []);



  // Callback to close the modal
  const handleCloseModal = () => {
    setShowLocationModal(false);
  };

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>
      <div className="carosal-compment mt-[90px]">
        <CarousalComponent slides={slides} />
      </div>
      <div>
        <Promo1 />
      </div>
      <div>
        <ServiceList />
      </div>
      <div>
        <Promo2 />
      </div>
      <div>
        <Footer />
      </div>

      {/* Show the LocationModal */}
      {showLocationModal && (
        <div className="fixed inset-0  justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef}>
            <LocationModal  onClose={handleCloseModal}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
