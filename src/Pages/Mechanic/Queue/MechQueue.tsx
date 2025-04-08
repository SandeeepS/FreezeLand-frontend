import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUserRegisteredServices } from "../../../Api/user";
import DynamicTable from "../../../components/Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { getAllAcceptedServices } from "../../../Api/mech";

interface AllAcceptedServices {
  _id: string;
  name: string;
  image: [];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  discription: string;
  locationName: object;
  status: string;
  currentMechanicId: string | null;
  acceptedAt: Date | null;
  workHistory: [
    {
      mechanicId: string;
      status: string;
      acceptedAt: Date;
      canceledAt: Date | null;
      reason: string | null;
    }
  ];
  isBlocked: boolean;
  isDeleted: boolean;
  serviceDetails:object;
  userDetails:object;
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
    case "completed":
      return "text-emerald-500";
    case "delayed":
      return "text-orange-500";
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
    case "pending":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};

const MechQueue: React.FC = () => {
  const navigate = useNavigate();
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.data._id;
  const [allRegisteredServices, setAllRegisteredService] = 
    useState<AllAcceptedServices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const result = await getAllUserRegisteredServices(mechanicId);
        const result = await getAllAcceptedServices(mechanicId);
        console.log("data reached", result);
        // if (result?.allRegisteredUserServices){
        //   setAllRegisteredService(result.allRegisteredUserServices);
        //   console.log(
        //     "Registered services from the frontend:",
        //     result.allRegisteredUserServices
        //   );
        // }
      } catch (error) {
        console.error(
          "Error occurred while fetching the registered services:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mechanicId]);

  // Define the columns for the service table
  const serviceColumns: TableColumn[] = [
    {
      key: "service",
      header: "Service",
      render: (value, item) => (
        <div className="flex items-center">
          <img
            src={item.logo || "/api/placeholder/48/48"}
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
      header: "User Name",
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <div className="flex items-center">
          <Circle className={`${getStatusColor(value)} mr-2 h-4 w-4`} />
          {value}
        </div>
      ),
    },
    {
      key: "deviceImage",
      header: "Device Image",
      render: (value, item) => (
        <div className="flex">
          {item.team?.map((member: string, idx: number) => (
            <img
              key={idx}
              src={member || "/api/placeholder/40/40"}
              alt="device"
              className={`w-10 h-10 rounded-full border-2 border-blueGray-50 shadow ${
                idx > 0 ? "-ml-4" : ""
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "completion",
      header: "Completion Status",
      render: (value, item) => (
        <div className="flex items-center">
          <span className="mr-2">{value}%</span>
          <div className="relative w-full">
            <div
              className={`overflow-hidden h-2 text-xs flex rounded ${
                getProgressColors(item.status).bg
              }`}
            >
              <div
                style={{ width: `${value}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-black justify-center ${
                  getProgressColors(item.status).bar
                }`}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Transform your data to match the table structure
  const formattedData =
    allRegisteredServices.length > 0
      ? allRegisteredServices.map((service: any) => ({
          id: service._id, // Store the original ID for navigation
          name: service.serviceDetails[0]?.name || "Unknown Service",
          logo: service.serviceDetails[0]?.image?.[0] || "/api/placeholder/48/48",
          userName: service.userDetails[0]?.name || service.name || "Unknown User",
          status: service.status || "pending",
          team: service.deviceImages || ["/api/placeholder/40/40"],
          completion: service.completionPercentage || 0,
          // Include original data for reference
          originalData: service
        }))
      : [];

  // Handle row click - Navigate to detail page
  const handleRowClick = (item: any) => {
    console.log("Clicked on service:", item);
    // Navigate to the detail page with the service ID
    navigate(`/user/registeredComplaintByUser/${item.id}`);
  };

  return (
    <DynamicTable
      title="Registered Services"
      columns={serviceColumns}
      data={
        loading ? [] : formattedData.length > 0 ? formattedData : sampleData
      }
      loading={loading}
      emptyMessage="No services registered yet"
      onRowClick={handleRowClick}
      className="mt-16 cursor-pointer" // Added cursor-pointer to indicate clickable rows
    />
  );
};

// Sample data to use when API data is not available
const sampleData = [
  {
    id: "sample1",
    name: "Argon Design System",
    logo: "/api/placeholder/48/48",
    userName: "John Doe",
    status: "pending",
    team: ["/api/placeholder/40/40", "/api/placeholder/40/40"],
    completion: 60,
  },
  {
    id: "sample2",
    name: "Angular Now UI Kit PRO",
    logo: "/api/placeholder/48/48",
    userName: "Jane Smith",
    status: "completed",
    team: ["/api/placeholder/40/40", "/api/placeholder/40/40"],
    completion: 100,
  },
];

export default MechQueue;