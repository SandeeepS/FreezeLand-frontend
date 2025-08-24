import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import AddressList from "./AddressList"; // new reusable component
import {
  IAddress,
  IAddressResponse,
  IMainProfileDetails,
  MainProfileDetailsData,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";
import { useLoaderData } from "react-router-dom";
import AddAddressForm from "./AddAddressForm";
import { AddUserAddress } from "../../../Api/user";
import { AddMechAddress } from "../../../Api/mech";

const MainProfile: React.FC<MainProfileDetailsData> = ({ role, getImage }) => {
  console.log("role is ", role);
  const userData = useLoaderData() as IMainProfileDetails;

  const [details, setDetails] = useState<IMainProfileDetails>({
    name: "",
    phone: "",
    email: "",
    profile_picture: "",
    address: [],
  });

  const [image, setImage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  useEffect(() => {
    setDetails({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      profile_picture: userData.profile_picture || "",
      address: userData.address || [],
    });
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (details.profile_picture) {
          const result = await getImage(details.profile_picture, "service");
          if (result) setImage(result.data.url);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [details]);

  // const handleSaveAddress = (newAddress: any) => {
  //   // For now just append to state
  //   setNewAddress((prev) => ({
  //     ...prev,
  //     address: [...prev.address, { ...newAddress, _id: Date.now().toString(), isDeleted: false }],
  //   }));

  //   Need to impliment the api in the user.ts
  // };
  let addressUpdateFunction: (address: IAddress) => Promise<any>;
  if (role == "user") {
    addressUpdateFunction = AddUserAddress;
  } else {
    addressUpdateFunction = AddMechAddress;
  }

  console.log("Address address update function isss", addressUpdateFunction);

  return (
    <div className="mt-16 flex flex-col items-center">
      {/* Profile Image */}
      <ProfileImage image={image} />

      {/* Basic Info */}
      <div className="mt-6 w-full max-w-lg bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {details.name}
        </h2>

        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            {details.email}
          </p>
          <p>
            <span className="font-medium text-gray-600">Phone:</span>{" "}
            {details.phone}
          </p>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-6 w-full max-w-lg">
        <AddressList
          addresses={details.address || []}
          role={role}
          onAddAddress={() => setShowAddForm(true)}
        />
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <AddAddressForm
          role={role}
          onClose={() => setShowAddForm(false)}
          onSave={addressUpdateFunction}
        />
      )}
    </div>
  );
};

export default MainProfile;
