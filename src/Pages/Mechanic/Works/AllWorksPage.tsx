import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import BuildIcon from "@mui/icons-material/Build";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../../../components/Common/DynamicTable";


// You'll need to create these API functions
import { getAllUserRegisteredServices, getImageUrl } from "../../../Api/mech";

interface ComplaintService {
  _id: string;
  name: string;
  image: string[];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  description: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails: object;
  serviceDetails: any[];
  status?: string;
  deviceImages?: string[];
  completionPercentage?: number;
  priority?: string;
  createdAt?: string;
}

// Define the base data item type with optional fields
export interface TableDataItem {
  [key: string]: any;
}

// Define the column configuration
export interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, item: TableDataItem) => React.ReactNode;
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "text-orange-500";
    case "in progress":
      return "text-blue-500";
    case "completed":
      return "text-emerald-500";
    case "delayed":
      return "text-red-500";
    case "on schedule":
      return "text-teal-500";
    default:
      return "text-gray-500";
  }
};

// Helper function to get progress bar colors
const getProgressColors = (status: string) => {
  switch (status) {
    case "completed":
    case "on schedule":
      return {
        bg: "bg-emerald-200",
        bar: "bg-emerald-500",
      };
    case "delayed":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    case "in progress":
      return {
        bg: "bg-blue-200",
        bar: "bg-blue-500",
      };
    case "pending":
      return {
        bg: "bg-orange-200",
        bar: "bg-orange-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AllWorksPage: React.FC = () => {
  const navigate = useNavigate();
  // const mechanicId = useSelector((state: RootState) => state.auth.mechData?._id);

  const [allComplaints, setAllComplaints] = useState<ComplaintService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Add state for storing image URLs
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [deviceImages, setDeviceImages] = useState<Record<string, string[]>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call for mechanics
        const result = await getAllUserRegisteredServices();
        
        console.log("Complaints data:", result);

        if (result?.allRegisteredUserServices) {
          setAllComplaints(result.allRegisteredUserServices);
          
          // Fetch images for services and devices
          fetchAllImages(result.allRegisteredUserServices);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Fetch image URLs for all services and devices
  const fetchAllImages = async (complaints: ComplaintService[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const complaint of complaints) {
      // Fetch service logo image from serviceDetails
      if (
        complaint.serviceDetails &&
        complaint.serviceDetails.length > 0 &&
        complaint.serviceDetails[0].imageKey
      ) {
        try {
          const imageResult = await getImageUrl(
            complaint.serviceDetails[0].imageKey,
            "service"
          );
          if (imageResult && imageResult.data && imageResult.data.url) {
            serviceImagesMap[complaint._id] = imageResult.data.url;
          }
        } catch (error) {
          console.error("Error fetching service image:", error);
        }
      }

      // Fetch device images from the image field
      if (complaint.image && complaint.image.length > 0) {
        const deviceImageUrls: string[] = [];

        for (const deviceImg of complaint.image) {
          try {
            const deviceImgResult = await getImageUrl(deviceImg, "service");
            if (
              deviceImgResult &&
              deviceImgResult.data &&
              deviceImgResult.data.url
            ) {
              deviceImageUrls.push(deviceImgResult.data.url);
            }
          } catch (error) {
            console.error("Error fetching device image:", error);
          }
        }

        if (deviceImageUrls.length > 0) {
          deviceImagesMap[complaint._id] = deviceImageUrls;
        }
      }
    }

    setServiceImages(serviceImagesMap);
    setDeviceImages(deviceImagesMap);
  };

  // Define the columns for the complaints table
  const complaintColumns: TableColumn[] = [
    {
      key: "service",
      header: "Service",
      render: (value, item) => (
        <div className="flex items-center">
          <img
            src={serviceImages[item.id] || "/api/placeholder/48/48"}
            className="h-12 w-12 bg-white rounded-full border"
            alt={item.name}
          />
          <span className="ml-3 font-bold text-black">
            {item.name || "Unknown Service"}
          </span>
        </div>
      ),
    },
    {
      key: "userName",
      header: "Customer",
      render: (value) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: "dateCreated",
      header: "Date Created",
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <div className="flex items-center">
          <CircleIcon sx={{ fontSize: 14 }} className={`${getStatusColor(value)} mr-2`} />
          {value}
        </div>
      ),
    },
    {
      key: "deviceImage",
      header: "Device Images",
      render: (value, item) => (
        <div className="flex">
          {deviceImages[item.id]?.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl || "/api/placeholder/40/40"}
              alt={`device-${idx}`}
              className={`w-10 h-10 rounded-full border-2 border-white shadow ${
                idx > 0 ? "-ml-4" : ""
              }`}
            />
          )) || (
            <img
              src="/api/placeholder/40/40"
              alt="No device image"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
          )}
        </div>
      ),
    },
    // {
    //   key: "completion",
    //   header: "Progress",
    //   render: (value, item) => (
    //     <div className="flex items-center">
    //       <span className="mr-2">{value}%</span>
    //       <div className="relative w-full">
    //         <div
    //           className={`overflow-hidden h-2 text-xs flex rounded ${
    //             getProgressColors(item.status).bg
    //           }`}
    //         >
    //           <div
    //             style={{ width: `${value}%` }}
    //             className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
    //               getProgressColors(item.status).bar
    //             }`}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   key: "action",
    //   header: "Action",
    //   render: (value, item) => (
    //     <button 
    //       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center"
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         handleTakeAction(item.id);
    //       }}
    //     >
    //       <BuildIcon sx={{ fontSize: 16 }} className="mr-1" />
    //       {item.status === "pending" ? "Take Up" : "Update"}
    //     </button>
    //   ),
    // },
  ];

  // Transform data for the table
  const formattedData =
    allComplaints.length > 0
      ? allComplaints.map((complaint: any) => ({
          id: complaint._id,
          name: complaint.serviceDetails[0]?.name || "Unknown Service",
          userName: complaint.name || "Unknown User",
          status: complaint.status || "pending",
          dateCreated: complaint.createdAt ? formatDate(complaint.createdAt) : "Unknown date",
          completion: complaint.completionPercentage || 0,
          description: complaint.description || "No description provided",
          originalData: complaint
        }))
      : [];

  // Handle row click - Navigate to detail page
  const handleRowClick = (item: any) => {
    console.log("Clicked on complaint:", item);
    navigate(`/mech/complaintDetails/${item.id}`);
  };

  // Handle action button click
  const handleTakeAction = (id: string) => {
    console.log("Taking action on complaint:", id);
    navigate(`/mechanic/update-complaint/${id}`);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Customer Service Requests</h1>
      <DynamicTable
        title="All Complaints"
        columns={complaintColumns}
        data={formattedData}
        loading={loading}
        emptyMessage="No service requests available. New requests will appear here when customers submit them."
        onRowClick={handleRowClick}
        className="cursor-pointer"
      />
    </div>
  );
};

export default AllWorksPage;