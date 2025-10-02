import React, { useState } from "react";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../../App/store";
import { getMechanicDetails } from "../../../Api/mech";
import { MechDetails } from "../../../interfaces/IComponents/Mechanic/IMechanicInterface";
import Footer from "../../User/Footer";
import { AddAddress } from "../../../interfaces/AddAddress";
import toast from "react-hot-toast";
import { MdLocationOff } from "react-icons/md";

const MechAllAddress: React.FC = () => {
  const [allAddress, setAllAddress] = useState<AddAddress[]>([]);
  const [mech, setMech] = useState<MechDetails>();
  const navigate = useNavigate();
  const mechanicData = useAppSelector((state) => state.auth.mechData);
  const mechId = mechanicData?.id;
  console.log("mechc is",mech);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getMechanicDetails(mechId as string);
        const mech = response?.data.result;
        console.log("Mechanic address from the backend is  ", mech.address);
        const filteredAddresses = (mech.address || []).filter(
          (address: AddAddress) => address.isDeleted === false
        );
        setAllAddress(filteredAddresses);
        setMech(mech);
      } catch (error) {
        console.log(
          "Failded to fetch the mech Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, [mechId]);

  const handleEditAddress = async (id: string | undefined) => {
    console.log("clicked the editbutton by ", id);
    navigate(`/mech/editAddress/${id}`);
  };

  // const handleRemoveAddress = async (id: string) => {
  //   try {
  //     const result = await handleRemoveMechAddress(mechId as string, id);
  //     console.log("result after removing address", result);
  //     if (result?.data.success === true) {
  //       toast.success("Address removed successfully");
  //       setAllAddress((prev) => prev.filter((address) => address._id !== id));
  //     } else {
  //       toast.error("Address removal failed");
  //     }
  //   } catch (error) {
  //     console.log("Error occured while removing the address", error);
  //   }
  // };

  return (
    <div className="bg-white h-full rounded-lg shadow-md flex flex-col space-y-12 overflow-y-auto mt-32 w-full">
      <div>
        {allAddress.length !== 0 && (
          <div>
            <h1 className="mx-5 font-exo font-bold text-2xl my-4  ">
              All addresses
            </h1>
          </div>
        )}

        <div className="h-screen">
          {allAddress.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <MdLocationOff className="text-7xl mb-4" />
              <p className="text-xl font-semibold">No addresses found</p>
              <p className="text-md mt-2">
                You haven't added any address yet. Click "Add Address" to get
                started!
              </p>
              {/* Optionally, add a button to add a new address */}
              <button
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => navigate("/mech/addAddress")}
              >
                Add Address
              </button>
            </div>
          ) : (
            allAddress.map((address) => (
              <div className="mx-6 " key={address._id}>
                <Card sx={{ maxWidth: 1700 }} className="flex justify-between">
                  <CardContent>
                    <Typography>{address.name}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {address.email}
                      <br />
                      {address.district}
                      <br />
                      Phone: {address.phone}
                      <br />
                      Pin: {address.pin}
                      <br />
                      {address.state}
                      <br />
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleEditAddress(address._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => console.log("removed the old remove address function add the common remove function of instead of it ")}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MechAllAddress;
