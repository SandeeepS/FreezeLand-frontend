import React from "react";
import Swal from "sweetalert2";
import { logout } from "../../Api/user";
import { useDispatch } from "react-redux";
import { userLogout } from "../../App/slices/AuthSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AccountSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = [
    { name: "Account", id: 1, path: "/user/account" },
    { name: "Edit Profile", id: 1, path: "/user/account/profile" },
    { name: "Address", id: 2, path: "/user/account/Address" },
    { name: "History", id: 3, path: "/user/account/History" },
    { name: "Payment", id: 1, path: "/user/account/Payment" },
  ];

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
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center h-full mx-3 my-6">
      {/* ... (Profile image and name code remains unchanged) ... */}
      
      {data.map((item) =>(
        <Link
          key={item.id}
          to={item.path}
          className={`w-full h-[50px] bg-gray-200 rounded m-2 flex justify-center items-center font-exo font-bold tracking-widest hover:bg-freeze-color hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300 ${
            window.location.pathname === item.path ? "bg-freeze-color text-freeze-color" : ""
          }`}
        >
          <h1 className="text-center">{item.name}</h1>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="w-full h-[50px] bg-gray-200 rounded m-2 flex justify-center items-center font-exo font-bold tracking-widest hover:bg-red-500 hover:text-white hover:shadow-lg cursor-pointer transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default AccountSidebar;
