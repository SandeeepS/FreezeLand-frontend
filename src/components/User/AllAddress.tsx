import React, { useState } from "react";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { AddAddress } from "../../interfaces/AddAddress";
import { setDefaultAddress } from "../../Api/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile } from "../../Api/user";
import Footer from "./Footer";
import { userDetails } from "../../interfaces/IComponents/User/IUserInterfaces";



const AllAddress: React.FC = () => {
  const [allAddress, setAllAddress] = useState<AddAddress[]>([]);
  const [user, setUser] = useState<userDetails>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getProfile();
        const user = response?.data.data.data;
        console.log("User address from the backend is  ", user.address);

        setAllAddress(user.address);
        setUser(user);
      } catch (error) {
        console.log(
          "Failded to fetch the user Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, []);

  const handleSetDefault = async (id: string | undefined) => {
    console.log("clicked for setDefault", id);
    const result = await setDefaultAddress(user?._id, id);
    console.log(result);
  };

  const handleEditAddress = async (id: string | undefined) => {
    console.log("clicked the editbutton by ", id);
    navigate(`/user/editAddress/${id}`);
  };

  return (
    <div className="bg-white h-full rounded-lg shadow-md flex flex-col space-y-12 overflow-y-auto mt-32 w-full">
      <div>
        <h1 className="mx-5 font-exo font-bold text-2xl my-4  ">
          All addresses
        </h1>
        <div className="h-screen">
          {allAddress.map((address) => (
            <div className="mx-6 ">
              <Card sx={{ maxWidth: 1700 }} className="flex justify-between">
                <CardContent>
                  <Typography>{address.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
                    onClick={() => handleSetDefault(address._id)}
                  >
                    Set as Default
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleEditAddress(address._id)}
                  >
                    Edit
                  </Button>
                  <Button size="small">Remove</Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AllAddress;
