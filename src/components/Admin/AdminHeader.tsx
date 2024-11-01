import React from "react";

interface AdminHeaderProps {
  heading: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ heading }) => {
  return (
    <div className="  rounded-lg h-12 mx-10 mt-5  bg-gradient-to-r from-blue-500 via-blue-500 to-black ">
      <h1 className="ml-10 pt-2 font-bold text-xl">{heading}</h1>
    </div>
  );
};

export default AdminHeader;
