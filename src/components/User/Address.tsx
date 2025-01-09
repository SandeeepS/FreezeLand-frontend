import React from "react";
import Box from "@mui/material/Box";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Footer from "./Footer";

const Address: React.FC = () => {
  const navigate = useNavigate();
  const handleAddAddress = () => {
    console.log("clicked the add address");
    navigate("/user/addAddress");
  };

  const handleButtonClick = () => {
    console.log("Button clicked successfully");
    navigate("/user/showAllAddress");
  };

  return (
    <div className="bg-white h-screen rounded-lg shadow-md flex flex-col space-y-12 mt-24">
      <div className=" flex justify-center mx-60 mt-12">
        <h1 className="text-2xl font-bold">Your Address</h1>
      </div>

      <div className="md:flex md:justify-center md:items-center  space-x-6 space-y-6">
        <div className="">
          <Box
            component="section"
            sx={{
              p: 2,
              width: 300,
              height: 300,
              border: "1px dashed grey",
              borderRadius: 2,
            }}
            className="cursor-pointer  hover:bg-gray-200  "
            onClick={handleAddAddress}
          >
            <FaPlus />
            Add Address
          </Box>
        </div>
        <div>
          <Box
            component="section"
            sx={{ p: 2, width: 300, height: 300, border: 1, borderRadius: 2 }}
            className="cursor-pointer hover:bg-gray-200 "
          >
            Default Address
            <hr className="border-t-2 border-gray-400" />
          </Box>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          className="md:w-96 w-full "
          variant="contained"
          onClick={handleButtonClick}
        >
          Show All Address
        </Button>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default Address;
