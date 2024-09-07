
import { useState } from 'react';
import {AiOutlineClose,AiOutlineMenu} from 'react-icons/ai';

function Header() {

  const [nav,setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  }

  return (
    <>
       <div style={{backgroundColor:'#078FDC'}} className='text-white font-bold h-[130px] flex justify-between'  >
            <h1 className="w-full text-3xl  text-black font-exo  p-10" >FREEZE <span className="text-white font-exo" >LAND</span> </h1>
            <ul className=" p-8 hidden md:flex  ">
                <li className="p-4">HOME</li>
                <li className="p-4">ACCOUNT</li>
                <li className="p-4">SERVICES</li>
                <li className="p-4">CONTACT</li>
                <li className="p-4">QUEUE</li>
            </ul>
            <div className='p-11 block md:hidden' onClick={handleNav}  >
              {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={25}/>}
                
            </div>
            <div className={!nav ? 'fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#078FDC] ease-in-out duration-500 ': 'fixed left-[-100%]'} >
            <h1 className="w-full text-3xl text-black font-exo  p-10" >FREEZE <span className="text-white font-exo" >LAND</span> </h1>
                <ul className='text-black pl-6'>
                    <li className="p-4 border-b border-white-600">HOME</li>
                    <li className="p-4 border-b">ACCOUNT</li>
                    <li className="p-4 border-b">SERVICES</li>
                    <li className="p-4 border-b">CONTACT</li>
                    <li className="p-4 border-b">QUEUE</li>
                </ul>
            </div>
       </div>
    </>
 
  )
}

export default Header;
