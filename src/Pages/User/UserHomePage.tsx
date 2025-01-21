import Header from "../../components/User/Header";
import CarousalComponent from "../../components/User/CarousalComponent";
import Promo1 from "../../components/User/Promo1";
import ServiceList from "../../components/User/ServiceList";
import Promo2 from "../../components/User/WhyChooseUs";
import Footer from "../../components/User/Footer";
const UserHomePage: React.FC = () => {
  // this slides are not using currently may be user in future
  // const slides = [
  //   "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-1.jpg?alt=media&token=4e592a41-7c70-4987-936f-339a9fbbbbe7",
  //   "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-2.jpg?alt=media&token=5fd03d8e-1b54-4236-9385-685f1dcaf09f",
  //   "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-3.jpg?alt=media&token=94c3c6bb-662d-43af-95a1-0afe321cbf6b",
  // ];

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
      text4:"we do."
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 w-full  z-10 ">
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
    </div>
  );
};

export default UserHomePage;
