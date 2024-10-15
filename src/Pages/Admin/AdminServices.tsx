import React from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const AdminServices: React.FC = () => {
  const navigate = useNavigate();
  const heading = "Services";
  const handleClick = () => {
    console.log("button clicked");
    navigate("/admin/addNewService");
  };
  return (
    <div>
      <AdminHeader heading={heading} />
      <div className="w-full ml-16 md:ml-56 h-screen bg-[#DFECF8]">
        <h1>Admin Serivces</h1>
        <Button onClick={handleClick} variant="contained">
          Add new Service
        </Button>
      </div>
    </div>
  );
};

export default AdminServices;
