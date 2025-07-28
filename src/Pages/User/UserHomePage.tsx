import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/User/Header";
import CarousalComponent from "../../components/User/CarousalComponent";
import Promo1 from "../../components/User/SubContentHomepage";
import ServiceList from "../../components/User/ServiceList";
import Promo2 from "../../components/User/WhyChooseUs";
import Footer from "../../components/User/Footer";
import LocationModal from "../../components/Common/LocationModal";
import { useAppSelector } from "../../App/store";
import { getProfile } from "../../Api/user";
import FallBackLoader from "../../components/Common/FallBackLoader";

const slides = [
  {
    image: "/Images/acWall1.jpg",
    text1: "Our vision   ",
    text2: "is to provide the",
    text3: "best service to",
    text4: "our customers.",
  },
  {
    image: "/Images/acWall2.jpg",
    text1: "We strive ",
    text2: "for excellence",
    text3: " in everything ",
    text4: "we do.",
  },
];

const UserHomePage: React.FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const userData = useAppSelector((state) => state.auth.userData);
  const userId = userData?.id;

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch user data and check for location field
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getProfile(userId as string);
        console.log("User details in the homepage is", userProfile);

        // Check if location field exists in the user data
        if (
          userProfile &&
          userProfile.data &&
          userProfile.data.data &&
          userProfile.data.data.data
        ) {
          const userData = userProfile.data.data.data;

          if ("locationData" in userData) {
            console.log("Location field is present:", userData.locationData);
          } else {
            const timer = setTimeout(() => {
              setShowLocationModal(true);
            }, 4000);

            return () => clearTimeout(timer); // Cleanup the timer on unmount
          }
        }
      } catch (error) {
        console.log(error as Error);
        throw error;
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Callback to close the modal
  const handleCloseModal = () => {
    setShowLocationModal(false);
  };

  return (
    <>
      {showSplash ? (
        <FallBackLoader/>
      ) : (
        <div className="home flex flex-col overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-10">
            <Header />
          </div>
          <div
         
          >
            
            <div className="carosal-compment mt-[90px]">
              <CarousalComponent slides={slides} />
            </div>
            <section id="promo1">
              <Promo1 />
            </section>
            <section id="serviceList" >
              <ServiceList />
            </section>
            <section id="promo2">
              <Promo2 />
            </section>
            <div>
              <Footer />
            </div>
          </div>

          {/* Show the LocationModal */}
          {showLocationModal && (
            <div className="fixed inset-0  justify-center bg-black bg-opacity-50 z-50">
              <div ref={modalRef}>
                <LocationModal
                  onClose={handleCloseModal}
                  userId={userId as string}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserHomePage;
