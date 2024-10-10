import React from "react";

const AccountSidebar: React.FC = () => {
  return (
    <div className="w-96 rounded  mx-7 mt-7">
      <div className=" flex-col bg-white rounded shadow-neutral-600 w-full h-[600px] justify-center ">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 overflow-hidden rounded-full">
            <img
              src="https://www.366icons.com/media/01/profile-avatar-account-icon-16699.png"
              alt="Profile Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Sandeep</h2>
        </div>
        <div className="w-full h-[50px] bg-black "></div>
      </div>
    </div>
  );
};

export default AccountSidebar;
