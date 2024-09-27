import CarousalComponent from "../../components/User/CarousalComponent";
import Footer from "../../components/User/Footer";
import MechHeader from "../../components/Mech/MechHeader";
import MechPromo1 from "../../components/Mech/MechPromo1";
import AssignedWorks from "../../components/Mech/AssignedWorks";
const MechanicHomePage: React.FC = () => {
  const slides = [
    "/src/Images/Mechcarousal-1.jpg",
    "/src/Images/Mechcarousal-1.jpg",
    "/src/Images/Mechcarousal-1.jpg",
  ];

  return (
    <>
      <MechHeader />
      <div className=" m-auto pt-5">
        <CarousalComponent slides={slides} />
      </div>
      <>
        <MechPromo1 />
      </>
      <>
        <AssignedWorks/>
      </>
      <>
        <Footer />
      </>
    </>
  );
};

export default MechanicHomePage;
