import React from "react";
import AdminListing from "../../components/Admin/AdminListing";
import AdminHeader from "../../components/Admin/AdminHeader";
// import DataListing from "../../components/Admin/DataListing";
import TableCommon from "../../components/Common/TableCommon";
import { getAllUsers } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";
import { blockUser } from "../../Api/admin";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted:boolean;
}

const AdminUserListing: React.FC = () => {

  const [data, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllUsers();
        console.log("user details in the first useEffect");
        setUsers(res?.data?.data?.users); // Adjust according to your API response structure
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, []);


  const updateUserStatus = (id: string, isBlocked: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, isBlocked } : user
      )
    );
  };


  return (
    <div className="h-screen flex">
      {/* side bar */}
      <AdminListing />
      {/* Contents */}
      <div className="w-3/4 bg-[#DFECF8]">
        <div>
          <AdminHeader heading="Users" />
          <div className="flex mx-10 justify-center items-center pt-7">
            <TableCommon data={data} updateUserStatus={updateUserStatus} blockUnblockFunciton={blockUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserListing;
