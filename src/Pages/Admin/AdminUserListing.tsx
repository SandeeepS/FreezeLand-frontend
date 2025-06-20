import React, { useState, useEffect } from "react";
import TableCommon from "../../components/Common/TableCommon";
import { getAllUsers, blockUser, deleteUser } from "../../Api/admin";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { UserData } from "../../interfaces/IPages/Admin/IAdminInterfaces";
import { useLocation, useSearchParams } from "react-router-dom";

const AdminUserListing: React.FC = () => {
  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      align: "right",
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150, align: "right" },
  ];
  const location = useLocation();
  const pathName = location.pathname;
  console.log("pathname is", pathName);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log('Search is ',search);

  const [data, setUsers] = useState<UserData[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const res = await getAllUsers(search);
        console.log("User details fetched:", res);
        setUsers(res?.data?.data?.users || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user data. Please try again later.");
      } 
    };
    fetchData();
  }, [search]);

  const updateUserStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setUsers((prevUsers) =>
      isDeleted
        ? prevUsers.filter((user) => user._id !== id)
        : prevUsers.map((user) =>
            user._id === id ? { ...user, isBlocked } : user
          )
    );
  };

  const filteredUsers = data?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );



  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className=" mx-4">
        
        <TopBar
          pathName={pathName}
          heading="All Users"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex items-center my-5">

      </div>
      <div className="flex justify-center items-center mx-5 h-screen">
        <TableCommon
          columns={columns}
          data={filteredUsers || []} 
          updateStatus={updateUserStatus}
          blockUnblockFunciton={blockUser}
          deleteFunction={deleteUser}
        />
      </div>
    </div>
  );
};

export default AdminUserListing;
