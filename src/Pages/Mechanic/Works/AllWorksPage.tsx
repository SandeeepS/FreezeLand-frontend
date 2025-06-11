import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../../../components/Common/DynamicTable";
import { getAllUserRegisteredServices, getImageUrl } from "../../../Api/mech";

interface ServiceDetail {
  _id: string;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge: number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

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
  serviceDetails: ServiceDetail[];
  status?: string;
  deviceImages?: string[];
  completionPercentage?: number;
  priority?: string;
  createdAt?: string;
}

export interface TableDataItem {
  [key: string]: unknown;
}

export interface TableColumn {
  key: string;
  header: string;
  render?: (value: unknown, item: TableDataItem) => React.ReactNode;
}

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

//progreess bar commented for future implimentation
// const getProgressColors = (status: string) => {
//   switch (status) {
//     case "completed":
//     case "on schedule":
//       return {
//         bg: "bg-emerald-200",
//         bar: "bg-emerald-500",
//       };
//     case "delayed":
//       return {
//         bg: "bg-red-200",
//         bar: "bg-red-500",
//       };
//     case "in progress":
//       return {
//         bg: "bg-blue-200",
//         bar: "bg-blue-500",
//       };
//     case "pending":
//       return {
//         bg: "bg-orange-200",
//         bar: "bg-orange-500",
//       };
//     default:
//       return {
//         bg: "bg-gray-200",
//         bar: "bg-gray-500",
//       };
//   }
// };

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
  const [allComplaints, setAllComplaints] = useState<ComplaintService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>(
    {}
  );
  const [deviceImages, setDeviceImages] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAllUserRegisteredServices();

        if (result?.allRegisteredUserServices) {
          setAllComplaints(result.allRegisteredUserServices);
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

  // Fetching image URLs for all services and devices
  const fetchAllImages = async (complaints: ComplaintService[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const complaint of complaints) {
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

  //Defining columns for the complaints table
  const complaintColumns: TableColumn[] = [
    {
      key: "service",
      header: "Service",
      render: (_: unknown, item: TableDataItem) => {
        const id = item.id as string;
        const name = item.name as string | undefined;
        return (
          <div className="flex items-center">
            <img
              src={serviceImages[id] || "/api/placeholder/48/48"}
              className="h-12 w-12 bg-white rounded-full border"
              alt={name}
            />
            <span className="ml-3 font-bold text-black">
              {name || "Unknown Service"}
            </span>
          </div>
        );
      },
    },
    {
      key: "userName",
      header: "Customer",
      render: (value) => <div className="font-medium">{String(value)}</div>,
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
          <CircleIcon
            sx={{ fontSize: 14 }}
            className={`${getStatusColor(value as string)} mr-2`}
          />
          {String(value)}
        </div>
      ),
    },
    {
      key: "deviceImage",
      header: "Device Images",
      render: (_: unknown, item: TableDataItem) => (
        <div className="flex">
          {deviceImages[item.id as string]?.map(
            (imgUrl: string, idx: number) => (
              <img
                key={idx}
                src={imgUrl || "/api/placeholder/40/40"}
                alt={`device-${idx}`}
                className={`w-10 h-10 rounded-full border-2 border-white shadow ${
                  idx > 0 ? "-ml-4" : ""
                }`}
              />
            )
          ) || (
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
      ? allComplaints.map((complaint: ComplaintService) => ({
          id: complaint._id,
          name: complaint.serviceDetails[0]?.name || "Unknown Service",
          userName: complaint.name || "Unknown User",
          status: complaint.status || "pending",
          dateCreated: complaint.createdAt
            ? formatDate(complaint.createdAt)
            : "Unknown date",
          completion: complaint.completionPercentage || 0,
          description: complaint.description || "No description provided",
          originalData: complaint,
        }))
      : [];

  const handleRowClick = (item: TableDataItem) => {
    console.log("Clicked on complaint:", item);
    navigate(`/mech/complaintDetails/${item.id}`);
  };

  // // Handle action button click keeped for future updated
  // const handleTakeAction = (id: string) => {
  //   console.log("Taking action on complaint:", id);
  //   navigate(`/mechanic/update-complaint/${id}`);
  // };

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
