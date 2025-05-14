import { useEffect, useState } from "react";
import {
  getAllComplaints,
  deleteComplaint,
  listUnlistComplaints,
} from "../../../Api/admin";
import TopBar from "../../../components/Admin/Dashboard/TopBar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ICompliantData } from "../../../interfaces/IPages/Admin/IAdminInterfaces";
import TableCommon from "../../../components/Common/TableCommon";



const AdminComplaintListing = () => {
  const naviagte = useNavigate()
  const location = useLocation();
  const pathName = location.pathname;
  console.log("pathname is", pathName);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [allComplaints, setAllComplaints] = useState<ICompliantData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  console.log("search is ", search);


  const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "isBlocked",
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value: boolean) => (value ? "Blocked" : "Active"),
  },
  { id: "actions", label: "Actions", minWidth: 150, align: "right" },
];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("entered in the useEffect in the admincomplaint listing ");
        const result = await getAllComplaints(search);
        console.log("result reached in the frontend", result);
        if (result?.data) {
          setAllComplaints(result?.data?.data?.complaints);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [search]);

  const updateComplaintStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setAllComplaints((prevComplaint) =>
      isDeleted
        ? prevComplaint.filter((complaint) => complaint._id !== id)
        : prevComplaint.map((complaint) =>
            complaint._id === id ? { ...complaint, isBlocked } : complaint
          )
    );
  };

  const handleViewMoreAboutComplaint = (id: string) => {
    naviagte(`/admin/viewMoreComplaintDetails/${id}`);  
  }

  const navigationLink = "/admin/editDevice/";

  const filteredComplaint = allComplaints
    .map((complaint) => ({
      ...complaint,
      status: complaint.status === "Blocked", // Convert string to boolean
    }))
    .filter((complaint) =>
      complaint.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="admin-complaint-listing flex flex-col h-screen">
      <div className="mb-5 mx-5">
        <TopBar
          pathName={pathName}
          heading="Registered Complaints"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="tableDiv flex justify-center items-center mx-10 h-screen">
        <TableCommon
          columns={columns}
          data={filteredComplaint}
          updateStatus={updateComplaintStatus}
          blockUnblockFunciton={listUnlistComplaints}
          deleteFunction={deleteComplaint}
          navLink={navigationLink}
          role={"admin"}
          handleViewMore={handleViewMoreAboutComplaint}
        />
      </div>
    </div>
  );
};

export default AdminComplaintListing;
