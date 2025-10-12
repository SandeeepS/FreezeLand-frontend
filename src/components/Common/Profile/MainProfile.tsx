import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import AddressList from "./AddressList";
import EditProfileModal from "./EditProfileModal";
import {
  IAddress,
  IMainProfileDetails,
  MainProfileDetailsData,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";
import AddAddressForm from "./AddAddressForm";
import {
  AddUserAddress,
  getProfile,
  setDefaultAddress,
  EditUserDetails,
} from "../../../Api/user";
import {
  AddMechAddress,
  EditMechProfileDetails,
  getMechanicDetails,
  setMechDefaultAddress,
} from "../../../Api/mech";
import { useAppSelector } from "../../../App/store";

interface UserDataType {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MainProfile: React.FC<MainProfileDetailsData> = ({ role, getImage }) => {
  console.log("role is ", role);

  const currentUserDataFromRedux: UserDataType | null =
    role === "user"
      ? useAppSelector((state) => state.auth.userData)
      : role === "mech"
      ? useAppSelector((state) => state.auth.mechData)
      : null;

  const getProfileFunction: (_id: string) => Promise<any> =
    role === "user"
      ? getProfile
      : role === "mech"
      ? getMechanicDetails
      : async () => {};

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
  const [showEditModal, setShowEditModal] = useState(false);

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
  let setAsDefaultFunction: (userId: string, addressId: string) => Promise<any>;
  let editProfileFunction: (values: any) => Promise<any> = async () => {};

  if (role == "user") {
    addressUpdateFunction = AddUserAddress;
    setAsDefaultFunction = setDefaultAddress;
    editProfileFunction = EditUserDetails;
  } else {
    addressUpdateFunction = AddMechAddress;
    setAsDefaultFunction = setMechDefaultAddress;
    editProfileFunction = EditMechProfileDetails;
  }

  const handleAddressSaved = (_updatedAddress: IAddress) => {
    setAddressRefreshKey((prev) => prev + 1);
  };

  console.log("Address address update function isss", addressUpdateFunction);

  return (
    <div className="mt-28 flex flex-col items-center">
      {/* Profile Image */}
      <ProfileImage image={image} />

      {/* Edit Profile Button */}
      <button
        onClick={() => setShowEditModal(true)}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Edit Profile
      </button>

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

      {/* Edit Profile Modal */}
      {showEditModal && currentUserDataFromRedux && (
        <EditProfileModal
          role={role === "user" ? "user" : "mech"}
          currentData={{
            _id: currentUserDataFromRedux.id,
            name: details.name,
            phone: String(details.phone),
            email: details.email,
            profile_picture: details.profile_picture ?? "",
          }}
          currentImage={image}
          onClose={() => setShowEditModal(false)}
          onSave={editProfileFunction}
        />
      )}
    </div>
  );
};

export default MainProfile;
