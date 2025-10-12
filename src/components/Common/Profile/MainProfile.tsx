import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import AddressList from "./AddressList"; // new reusable component
import {
  IAddress,
  IMainProfileDetails,
  MainProfileDetailsData,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";
import AddAddressForm from "./AddAddressForm";
import { AddUserAddress, getProfile, setDefaultAddress } from "../../../Api/user";
import { AddMechAddress, getMechanicDetails, setMechDefaultAddress } from "../../../Api/mech";
import { useAppSelector } from "../../../App/store";

interface UserDataType {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MainProfile: React.FC<MainProfileDetailsData> = ({ role, getImage }) => {
  console.log("role is ", role);

  let currentUserDataFromRedux: UserDataType | null;
  let getProfileFunction: (_id: string) => Promise<any>;
  if (role == "user") {
    currentUserDataFromRedux = useAppSelector((state) => state.auth.userData);
    getProfileFunction = getProfile;
  } else if (role == "mech") {
    currentUserDataFromRedux = useAppSelector((state) => state.auth.mechData);
    getProfileFunction = getMechanicDetails;
  }

  const [addressRefreshKey, setAddressRefreshKey] = useState(0);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
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
    const fetch = async () => {
      try {
        if (currentUserDataFromRedux) {
          let result = await getProfileFunction(currentUserDataFromRedux.id);
          let fetchedData;
          console.log("fetched data is ", result);
          if (role == "user") {
            fetchedData = result.data.data.data;
          } else {
            fetchedData = result.data.result;
          }
          setDetails({
            name: fetchedData.name || "",
            email: fetchedData.email || "",
            phone: fetchedData.phone || "",
            profile_picture: fetchedData.profile_picture || "",
            address: fetchedData.address || [],
          });
        }
      } catch (error) {
        console.log(
          "error occured while fetching userDetails from the backend ",
          error
        );
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("slfsdflksdflksdfnlsdn");
        if (details.profile_picture) {
          const result = await getImage(details.profile_picture, "service");
          console.log("Resul after getting the image is ", result);
          if (result) setImage(result.data.url);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [details.profile_picture]);

  useEffect(() => {
    console.log("image is ", image);
  });

  let addressUpdateFunction: (address: IAddress) => Promise<any>;
  let setAsDefaultFunction:(userId:string,addressId:string) => Promise<any>

  if (role == "user") {
    addressUpdateFunction = AddUserAddress;
    setAsDefaultFunction = setDefaultAddress;
  } else {
    addressUpdateFunction = AddMechAddress;
    setAsDefaultFunction = setMechDefaultAddress;
  }

  const handleAddressSaved = (_updatedAddress: IAddress) => {
    setAddressRefreshKey((prev) => prev + 1);
  };

  console.log("Address address update function isss", addressUpdateFunction);

  return (
    <div className="mt-28 flex flex-col items-center">
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
          key={addressRefreshKey}
          role={role}
          onAddAddress={() => setShowAddForm(true)}
          onEditAddress={(addr) => {
            setFormMode("edit");
            setEditingAddress(addr);
            setShowAddForm(true);
          }}
          onSetDefaultAddress={setAsDefaultFunction}
        />
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <AddAddressForm
          role={role}
          mode={formMode}
          initialData={editingAddress || undefined}
          onClose={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
          onSave={async (addr) => {
            const response = await addressUpdateFunction(addr);
            if (response?.data?.result) {
              handleAddressSaved(response.data.result);
            }
            return response;
          }}
        />
      )}
    </div>
  );
};

export default MainProfile;
