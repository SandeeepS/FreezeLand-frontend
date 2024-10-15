import React from "react";

// import DataListing from "../../components/Admin/DataListing";
import TableCommon from "../../components/Common/TableCommon";
import { getAllUsers } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";
import { blockUser } from "../../Api/admin";
import { deleteUser } from "../../Api/admin";
import AdminHeader from "../../components/Admin/AdminHeader";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const AdminUserListing: React.FC = () => {
  const [data, setUsers] = useState<UserData[]>([]);
  const heading = "Users";

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

  const updateUserStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setUsers((prevUsers) =>
      isDeleted
        ? prevUsers.filter((user) => user._id !== id) // Remove deleted user
        : prevUsers.map((user) =>
            user._id === id ? { ...user, isBlocked } : user
          )
    );
  };

  return (
    <div>
      <AdminHeader heading={heading} />

      <div className="flex mx-10 justify-center items-center pt-7 h-screen">
        <TableCommon
          data={data}
          updateUserStatus={updateUserStatus}
          blockUnblockFunciton={blockUser}
          deleteUser={deleteUser}
        />
      </div>
    </div>
  );
};

export default AdminUserListing;
