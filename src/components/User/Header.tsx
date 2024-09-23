import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

function Header() {
  const [nav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <div className='text-white font-bold h-[130px] flex justify-between bg-freeze-color'>
        <h1 className="w-full text-3xl text-black font-exo p-10">
          FREEZE <span className="text-white font-exo">LAND</span>
        </h1>
        {/* Desktop Menu */}
        <ul className="p-8 hidden md:flex">
          <li className="p-4">HOME</li>
          <li className="p-4">ACCOUNT</li>
          <li className="p-4">SERVICES</li>
          <li className="p-4">CONTACT</li>
          <li className="p-4">QUEUE</li>
          {/* Logout Button */}
          <li className="p-4">
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className='p-11 block md:hidden' onClick={handleNav}>
          {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={25} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            !nav
              ? 'fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#078FDC] ease-in-out duration-500'
              : 'fixed left-[-100%]'
          }
        >
          <h1 className="w-full text-3xl text-black font-exo p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <ul className='text-black pl-6'>
            <li className="p-4 border-b">HOME</li>
            <li className="p-4 border-b">ACCOUNT</li>
            <li className="p-4 border-b">SERVICES</li>
            <li className="p-4 border-b">CONTACT</li>
            <li className="p-4 border-b">QUEUE</li>
            {/* Logout Button */}
            <li className="p-4 border-b">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
