import React from "react";
import AntarticaImage from "../../Images/Antartica.jpg";
import { useAppSelector } from "../../App/store";
import { getProfile } from "../../Api/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface userDetails {
  name: string;
  email: string;
  phone: number;
  address?: string;
  location?: string;
}

const ProfileDetails: React.FC = () => {
  const { userData } = useAppSelector((state) => state.auth);
  console.log("User Details from the account side ", userData);
  const [userDetails, setUserDetails] = useState<userDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getProfile();
        const user = response?.data.data.data;
        console.log("User details from the backend in the Account is ", user);

        setUserDetails(user);
      } catch (error) {
        console.log(
          "Failded to fetch the user Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, []);


  const editProfile = () => {
      navigate('/user/account/profile')
  }
  return (
    <>
      {userDetails ? (
        <div className="flex flex-col">
          <div
            style={{
              backgroundImage: `url(${AntarticaImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
            }}
            className="grid grid-cols-6 col-span-2 justify-between bg-white rounded-tl-lg rounded-tr-lg items-center pt-5 text-xs uppercase font-[500] relative "
          >
            {/* Black Div */}
            <div className="col-end-8 col-span-2 flex justify-center items-center">
              <div className="bg-white w-36 h-36 rounded-md items-center justify-center hidden lg:block  mb-4 mr-6 flex-col">
                <div className="w-[78%]">
                  <img className="" src="/src/Images/businessman.png" alt="" />
                </div>
                <div className="flex flex-row w-full items-baseline justify-between ">
                  <button onClick={editProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  w-full ">
                    Edit
                  </button>

                
                </div>
              </div>
            </div>
          </div>
          <div className="space-x-4  bg-white grid grid-cols-2 p-10">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={userDetails.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="number "
                value={userDetails.phone}
                readOnly
                className="w-full  px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                value={userDetails.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                value={
                  userDetails.location ? userDetails.location : "Add Location !"
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700">Pincode</label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex  justify-center items-center bg-white">
            <div className="w-full mx-10 mb-4">
              <label className="block text-gray-700">Address</label>
              <textarea
                value={
                  userDetails.address
                    ? userDetails.address
                    : "Address is not Added "
                }
                readOnly
                rows={4} // Number of lines visible in textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>UserDetails Loading...</p>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;
