import { useEffect, useState } from "react";
import {
  getAllComplaints,
  deleteComplaint,
} from "../../../Api/admin";
import TopBar from "../../../components/Admin/Dashboard/TopBar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ICompliantData } from "../../../interfaces/IPages/Admin/IAdminInterfaces";
import TableCommon from "../../../components/Common/TableCommon";

const AdminComplaintListing = () => {
  const naviagte = useNavigate();
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
  };

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
    <div className="admin-complaint-listing flex flex-col h-[695px]">
      <div className="mx-4">
        <TopBar
          pathName={pathName}
          heading="Registered Complaints"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex  justify-center my-5"></div>

      <div className="tableDiv flex  mx-5 h-screen">
        <TableCommon
          columns={columns}
          data={filteredComplaint}
          updateStatus={updateComplaintStatus}
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
