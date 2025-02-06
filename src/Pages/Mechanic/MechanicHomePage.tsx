import CarousalComponent from "../../components/User/CarousalComponent";
import Footer from "../../components/User/Footer";
import MechHeader from "../../components/Mech/MechHeader";
import MechPromo1 from "../../components/Mech/MechPromo1";
import AssignedWorks from "../../components/Mech/AssignedWorks";
const MechanicHomePage: React.FC = () => {
  const slides = [
    {
      image: "/src/Images/technicianWork.jpg",
      text1: "Our vision   ",
      text2: "is to provide the",
      text3: "best service to",
      text4: "our customers.",
    },
    {
      image: "/src/Images/Mechcarousal-1.jpg",
      text1: "We strive ",
      text2: "for excellence",
      text3: " in everything ",
      text4: "we do.",
    },
    {
      image: "/src/Images/spanner.jpg",
      text1: "Our vision   ",
      text2: "is to provide the",
      text3: "best service to",
      text4: "our customers.",
    },
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
        <AssignedWorks />
      </>

      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};

export default MechanicHomePage;
