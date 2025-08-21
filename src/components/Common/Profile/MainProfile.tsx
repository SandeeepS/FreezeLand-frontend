import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import AddressList from "./AddressList"; // new reusable component
import {
  IMainProfileDetails,
  MainProfileDetailsData,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";
import { useLoaderData } from "react-router-dom";
import AddAddressForm from "./AddAddressForm";

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
  const [newAddress , setNewAddress] = useState("")
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

  //   // Later: call backend API to save new address
  // };

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
          onClose={() => setShowAddForm(false)}
          // onSave={handleSaveAddress}
        />
      )}
    </div>
  );
};

export default MainProfile;
