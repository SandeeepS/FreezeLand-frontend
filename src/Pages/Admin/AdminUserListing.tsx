import React from "react";
import AdminListing from "../../components/Admin/AdminListing";
import AdminHeader from "../../components/Admin/AdminHeader";
// import DataListing from "../../components/Admin/DataListing";
import Table from "../../components/Common/TableCommon";

const AdminUserListing: React.FC = () => {
  return (
    <div className="h-screen flex">
      {/* side bar */}
      <AdminListing />
      {/* Contents */}
      <div className="w-3/4 bg-[#DFECF8]">
        <div>
          <AdminHeader heading="Users" />
          <div className="flex mx-10 justify-center items-center pt-7">
            <Table/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserListing;
