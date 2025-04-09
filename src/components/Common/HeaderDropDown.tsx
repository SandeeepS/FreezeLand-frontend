import React from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
// import { CgProfile } from "react-icons/cg";
// import { MdContactless } from "react-icons/md";
// import { MdEventNote } from "react-icons/md";
// import { IoIosSettings } from "react-icons/io";
import { MdPowerSettingsNew } from "react-icons/md";
import { HeaderDropDownProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";

const HeaderDropDown: React.FC<HeaderDropDownProps> = ({
  isOpen,
  onClose,
  logout,
  authLogout,
  navigateTo,
  coverImage,
  profileImage,
  userName,
  userRole,
  navigationItems,
}) => {
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
          dispatch(authLogout());
          toast.success("You are logged out!");
          navigate(navigateTo);
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <div className="absolute right-0 top-10 rounded-lg mt-16 mr-8 w-64 bg-stone-100 shadow-lg z-10">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src={coverImage}
          alt="Cover"
        />
      </div>

      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src={profileImage}
          alt="Profile"
        />
      </div>

      <div className="text-center mt-2">
        <h2 className="font-semibold text-black">{userName}</h2>
        <p className="text-gray-500">{userRole}</p>
      </div>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-400" />

      <ul className="p-4">
        {navigationItems.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className="text-black flex items-center my-1 text-sm cursor-pointer hover:bg-stone-200 p-2 rounded"
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </li>
        ))}

        <li>
          <div className="flex items-center cursor-pointer hover:bg-stone-200 p-2 rounded">
            <MdPowerSettingsNew className="text-red-500 h-4 w-4 mr-2" />
            <button
              onClick={handleLogout}
              className="bg-transparent border-none p-0 mr-2 text-sm text-black"
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
