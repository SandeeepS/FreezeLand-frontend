import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { MdPowerSettingsNew } from "react-icons/md";
import { HeaderDropDownProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { persistor } from "../../App/store";
import { useEffect, useRef, useState } from "react";

const HeaderDropDown: React.FC<HeaderDropDownProps> = ({
  isOpen,
  onClose,
  logout,
  authLogout,
  navigateTo,
  profileImage,
  userName,
  navigationItems,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
          persistor.purge();
          toast.success("You are logged out!");
          navigate(navigateTo);
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-10 rounded-lg mt-16 mr-8 w-64  bg-stone-100 shadow-lg z-10"
    >
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="/Images/Antartica.jpg"
          alt="Cover"
        />
      </div>

      <div className="mx-auto w-32 h-32 relative bg-white  -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src={
            imageError || !profileImage
              ? "https://cdn-icons-png.flaticon.com/128/64/64572.png"
              : profileImage
          }
          alt="Profile Picture"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="text-center mt-2">
        <h2 className="font-semibold text-black">{userName}</h2>
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
          <div
            onClick={handleLogout}
            className="flex items-center cursor-pointer hover:bg-stone-200 p-2 rounded"
          >
            <MdPowerSettingsNew className="text-red-500 h-4 w-4 mr-2" />
            <button className="bg-transparent border-none p-0 mr-2 text-sm text-black">
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
