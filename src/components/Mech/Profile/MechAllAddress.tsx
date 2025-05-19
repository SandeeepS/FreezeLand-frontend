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

const MechAllAddress: React.FC = () => {
  const [allAddress, setAllAddress] = useState<AddAddress[]>([]);
  const [mech, setMech] = useState<MechDetails>();
  const navigate = useNavigate();
  const mechanicData = useAppSelector((state) => state.auth.mechData);
  const mechId = mechanicData?.id;
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getMechanicDetails(mechId as string);
        const mech = response?.data.result;
        console.log("Mechanic address from the backend is  ", mech.address);

        setAllAddress(mech.address);
        setMech(mech);
      } catch (error) {
        console.log(
          "Failded to fetch the mech Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, []);

  const handleSetDefault = async (id: string | undefined) => {
    console.log("clicked for setDefault", id);
    const result = await setDefaultAddress(mech?._id, id);
    console.log(result);
  };

  const handleEditAddress = async (id: string | undefined) => {
    console.log("clicked the editbutton by ", id);
    navigate(`/mech/editAddress/${id}`);
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

export default MechAllAddress;
