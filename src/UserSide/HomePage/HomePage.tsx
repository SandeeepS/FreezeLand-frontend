
import Header from "../Components/Header"
import CarousalComponent from "../../components/CarousalComponent"
import Promo1 from "./Promo1"
import ServiceList from "./ServiceList"
function HomePage() {

    
  const slides = [
        "/src/Images/carousal-1.jpg",
         "/src/Images/carousal-2.jpg",
          "/src/Images/carousal-3.jpg"

  ]

  return (
    <>
       <Header  />
       <div className=' m-auto pt-5'>
        <CarousalComponent slides={slides}/>
       </div>

       <>
        <Promo1/>
       </>

       <>
       <ServiceList/>
       </>

       
    </>
  )
}

export default HomePage
