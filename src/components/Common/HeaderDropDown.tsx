import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../Api/user";
import { useDispatch } from "react-redux";
import { userLogout } from "../../App/slices/AuthSlice";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { MdContactless } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { MdPowerSettingsNew } from "react-icons/md";

const HeaderDropDown: React.FC = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) return null;

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
    <div className="absolute right-0 top-10 rounded-lg mt-16 mr-8 w-64 bg-stone-100 shadow-lg">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>

      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Woman looking front"
        />
      </div>

      <div className="text-center mt-2">
        <h2 className="font-semibold text-black">Sarah Smith</h2>
        <p className="text-gray-500">Freelance Web Designer</p>
      </div>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-400" />

      {/* <button onClick={onClose} className="absolute top-2 right-2 text-black">
        X
      </button> */}
      <ul className="p-4 ">
        <li
          onClick={() => navigate("/user/account")}
          className="text-black flex items-center my-1  text-sm"
        >
          <CgProfile className="mr-2" />
          Profile
        </li>

        <li
          onClick={() => navigate("/user/contact")}
          className="text-black flex items-center  my-1  text-sm "
        >
          <MdContactless className="mr-2" />
          Contact
        </li>
        <li
          onClick={() => navigate("/user/address")}
          className="text-black flex  items-center  my-1  text-sm "
        >
          <MdEventNote className="mr-2" />
          Address
        </li>
        <li
          onClick={() => navigate("/user/address")}
          className="text-black flex  items-center  my-1  text-sm"
        >
          <IoIosSettings className="mr-2" />
          Settings
        </li>

        <li>
          <div className="flex items-center">
            <MdPowerSettingsNew className="text-red-500 h-4 w-4 mr-2" />

            <button
              onClick={handleLogout}
              className="bg-transparent border-none p-0 mr-2  text-sm text-black"
            >
              Logout
            </button>
          </div>
        </li>
      </ul>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-400" />
    </div>
  );
};

export default HeaderDropDown;
