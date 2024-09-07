import './App.css'
import CarousalComponent from './components/CarousalComponent'
import Header from './UserSide/Header'


function App() {

  const slides = [
    ' https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=400',

  ]

  return (
    <>
       <Header  />
       <div className='w-[20%] m-auto'>
           <CarousalComponent slides={slides}/>
       </div>
       
    </>
  )
}

export default App
