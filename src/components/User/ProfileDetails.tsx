import React from "react";
import AntarticaImage from "../../Images/Antartica.jpg";

const ProfileDetails: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <div
          style={{
            backgroundImage: `url(${AntarticaImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
          }}
          className="grid grid-cols-6 col-span-2 justify-between bg-white rounded-tl-lg rounded-tr-lg  items-baseline pt-5 text-xs uppercase font-[500]  "
        >
          <div></div>
          <div className="col-end-8 col-span-2 bg-black w-36 h-36 rounded-md   sm:w-32 sm:h-32 md:w-38 md:h-38 lg:w-40 lg:h-40 mb-4"></div>
        </div>
        <div className="space-x-4  bg-white grid grid-cols-2 p-10  ">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value=""
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="email"
              value=""
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value=""
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value=""
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              value=""
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
              value="User Address"
              readOnly
              rows={4} // Number of lines visible in textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
