import React from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Swal from "sweetalert2";
import { logout } from "../../Api/user";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { userLogout } from "../../App/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const Header:React.FC = () =>  {
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const dispatch = useDispatch();
  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          logout().then(() => console.log(""));
          dispatch(userLogout());
          toast.success("You are logged out!");
          navigate("/login");
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <>
      <div className="text-white font-bold h-[130px] flex justify-between   w-full bg-freeze-color">
        <h1 className="w-full text-3xl text-black font-exo p-10">
          FREEZE <span className="text-white font-exo">LAND</span>
        </h1>
        {/* Desktop Menu */}
        <ul className="p-8 hidden md:flex">
          <li className="p-4 cursor-pointer" onClick={() => navigate('/user/homepage')} >HOME</li>
          <li className="p-4 cursor-pointer" onClick={() => navigate('/user/account')}>ACCOUNT</li>
          <li className="p-4 cursor-pointer">SERVICES</li>
          <li className="p-4 cursor-pointer">CONTACT</li>
          <li className="p-4 cursor-pointer">QUEUE</li>
          {/* Logout Button */}
          <li className="p-4">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="p-11 block md:hidden" onClick={handleNav}>
          {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={25} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            !nav
              ? "fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#078FDC] ease-in-out duration-500"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl text-black font-exo p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <ul className="text-black pl-6">
            <li className="p-4 border-b cursor-pointer">HOME</li>
            <li className="p-4 border-b cursor-pointer">ACCOUNT</li>
            <li className="p-4 border-b cursor-pointer">SERVICES</li>
            <li className="p-4 border-b cursor-pointer">CONTACT</li>
            <li className="p-4 border-b cursor-pointer">QUEUE</li>
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
