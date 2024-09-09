
import Header from "./Header"
import CarousalComponent from "../components/CarousalComponent"
function HomePage() {

    
  const slides = [
    ' https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=400',

  ]

  return (
    <>
       <Header  />
       <div className='w-[20%] m-auto pt-5'>
           <CarousalComponent slides={slides}/>
       </div>

       <div className="pageBackGround  w-full h-[300px]" >
          <h1>Hello</h1>
       </div>
       
    </>
  )
}

export default HomePage
