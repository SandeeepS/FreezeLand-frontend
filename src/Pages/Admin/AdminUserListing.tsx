import React from "react";
import AdminListing from "../../components/Admin/AdminListing";
import AdminHeader from "../../components/Admin/AdminHeader";
import DataListing from "../../components/Admin/DataListing";

const AdminUserListing: React.FC = () => {
  return (
    <div className="h-screen flex">
      {/* side bar */}
      <AdminListing />
      {/* Contents */}
      <div className="w-3/4 bg-[#DFECF8]">
        <div>
          <AdminHeader heading="Users" />
          <div className="flex justify-center items-center">
            <DataListing />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserListing;
