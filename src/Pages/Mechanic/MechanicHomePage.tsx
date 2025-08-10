import CarousalComponent from "../../components/User/CarousalComponent";
import Footer from "../../components/User/Footer";
import MechHeader from "../../components/Mech/MechHeader";
import MechPromo1 from "../../components/Mech/MechPromo1";
import AssignedWorks from "../../components/Mech/AssignedWroks/AssignedWorks";
import { useEffect, useState } from "react";
import FallBackLoader from "../../components/Common/FallBackLoader";
const MechanicHomePage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      image: "/Images/technicianWork.jpg",
      text1: "Our vision   ",
      text2: "is to provide the",
      text3: "best service to",
      text4: "our customers.",
    },
    {
      image: "/Images/Mechcarousal-1.jpg",
      text1: "We strive ",
      text2: "for excellence",
      text3: " in everything ",
      text4: "we do.",
    },
    {
      image: "/Images/spanner.jpg",
      text1: "Our vision   ",
      text2: "is to provide the",
      text3: "best service to",
      text4: "our customers.",
    },
  ];

  return (
    <>
      {showSplash ? (
        <FallBackLoader />
      ) : (
        <div className="home flex flex-col overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-10">
            <MechHeader />
          </div>
          <div className="m-auto pt-5">
            <CarousalComponent slides={slides} />
          </div>
          <>
            <MechPromo1 />
          </>
          <>
            <AssignedWorks />
          </>

          <div className="mt-5">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default MechanicHomePage;
