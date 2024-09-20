
import Header from "../components/User/Header"
import CarousalComponent from "../components/User/CarousalComponent"
import Promo1 from "../components/User/Promo1"
import ServiceList from "../components/User/ServiceList"
const HomePage : React.FC= ()=>{
 
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
