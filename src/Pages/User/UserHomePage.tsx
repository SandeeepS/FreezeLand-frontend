import Header from "../../components/User/Header";
import CarousalComponent from "../../components/User/CarousalComponent";
import Promo1 from "../../components/User/Promo1";
import ServiceList from "../../components/User/ServiceList";
import Promo2 from "../../components/User/Promo2";
import Footer from "../../components/User/Footer";
const UserHomePage: React.FC = () => {
  const slides = [
    "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-1.jpg?alt=media&token=4e592a41-7c70-4987-936f-339a9fbbbbe7",
    "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-2.jpg?alt=media&token=5fd03d8e-1b54-4236-9385-685f1dcaf09f",
    "https://firebasestorage.googleapis.com/v0/b/freezeland-79b5a.appspot.com/o/carousal-3.jpg?alt=media&token=94c3c6bb-662d-43af-95a1-0afe321cbf6b",
  ];

  return (
    <>
      <Header />
      <div className=" m-auto pt-5">
        <CarousalComponent slides={slides} />
      </div>
      <>
        <Promo1 />
      </>
      <>
        <ServiceList />
      </>
      <>
        <Promo2 />
      </>
      <>
        <Footer />
      </>
    </>
  );
};

export default UserHomePage;
