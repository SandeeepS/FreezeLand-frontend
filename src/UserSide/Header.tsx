
import {AiOutlineClose,AiOutlineMenu} from 'react-icons/ai';

function Header() {
  return (
    <>
       <div style={{backgroundColor:'#078FDC'}} className='text-white font-bold h-[130px] flex justify-between'  >
            <h1 className="w-full text-3xl text-black font-exo  p-10" >FREEZE <span className="text-white font-exo" >LAND</span> </h1>
            <ul className="flex p-8  ">
                <li className="p-4">HOME</li>
                <li className="p-4">ACCOUNT</li>
                <li className="p-4">SERVICES</li>
                <li className="p-4">CONTACT</li>
                <li className="p-4">QUEUE</li>
            </ul>
            <div className='p-11' >
                <AiOutlineMenu size={25}/>
            </div>
            <div className='fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900' >
                <ul className='text-black pt-24'>
                    <li className="p-4">HOME</li>
                    <li className="p-4">ACCOUNT</li>
                    <li className="p-4">SERVICES</li>
                    <li className="p-4">CONTACT</li>
                    <li className="p-4">QUEUE</li>
                </ul>
            </div>
       </div>
    </>
 
  )
}

export default Header;
