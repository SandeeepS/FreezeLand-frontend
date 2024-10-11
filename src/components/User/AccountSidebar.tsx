import React from "react";
import Swal from "sweetalert2";
import { logout } from "../../Api/user";
import { useDispatch } from "react-redux";
import { userLogout } from "../../App/slices/AuthSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AccountSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <div className="flex flex-col items-center h-full">
        <div className="w-32 h-32 overflow-hidden rounded-full mt-3">
          <img
            src="https://www.366icons.com/media/01/profile-avatar-account-icon-16699.png"
            alt="Profile Avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Sandeep</h2>
        <div className="w-full h-[50px] bg-gray-200  rounded m-2 flex justify-center items-center font-exo font-bold tracking-widest  hover:bg-freeze-color hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300">
          <h1 className="text-center">Profile</h1>
        </div>
        <div className="w-full h-[50px] bg-gray-200   rounded  m-2 flex justify-center items-center font-exo font-bold tracking-widest  hover:bg-freeze-color hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300">
          <h1>Address</h1>
        </div>
        <div className="w-full h-[50px] bg-gray-200   rounded  m-2 flex justify-center items-center font-exo font-bold tracking-widest  hover:bg-freeze-color hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300">
          <h1>History</h1>
        </div>
        <div className="w-full h-[50px] bg-gray-200   rounded  m-2 flex justify-center items-center font-exo font-bold tracking-widest  hover:bg-freeze-color hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300">
          <h1>Payments</h1>
        </div>

        <button
          onClick={handleLogout}
          className="w-full h-[50px] bg-gray-200   rounded  m-2 flex justify-center items-center font-exo font-bold tracking-widest  hover:bg-red-500 hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default AccountSidebar;
