import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import DynamicTable, { ColumnType } from "../../../components/Common/DynamicTable";
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

// Define the exact shape of your table data
export interface FormattedComplaintData {
  id: string;
  name: string;
  userName: string;
  status: string;
  dateCreated: string;
  completion: number;
  description: string;
  originalData: ComplaintService;
  service: string; // Add this for the service column
  deviceImage: string; // Add this for the device image column
   [key: string]: unknown;
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

  // Import the ColumnType from DynamicTable and use it properly
  const complaintColumns: ColumnType<FormattedComplaintData>[] = [
    {
      key: "service",
      header: "Service",
      render: (_, item) => {
        const id = item.id;
        const name = item.name;
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
      render: (_, item) => (
        <div className="flex">
          {deviceImages[item.id]?.map(
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
  ];

  // Transform data for the table with proper typing
  const formattedData: FormattedComplaintData[] =
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
          service: complaint.serviceDetails[0]?.name || "Unknown Service", // Add this
          deviceImage: complaint.image?.[0] || "", // Add this
        }))
      : [];

  const handleRowClick = (item: FormattedComplaintData) => {
    console.log("Clicked on complaint:", item);
    navigate(`/mech/complaintDetails/${item.id}`);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Customer Service Requests</h1>
      <DynamicTable<FormattedComplaintData>
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