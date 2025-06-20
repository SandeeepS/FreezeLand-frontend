import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUserRegisteredServices, getImageUrl } from "../../../Api/user";
import DynamicTable, { ColumnType } from "../../Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { AllRegisteredServices } from "../../../interfaces/IComponents/User/IUserInterfaces";
import { MdOutlineSpeakerNotesOff } from "react-icons/md";

// Define the formatted data interface with index signature
interface FormattedQueueData {
  id: string;
  name: string;
  userName: string;
  status: string;
  completion: number;
  originalData: AllRegisteredServices;
  [key: string]: unknown;
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "text-orange-500";
    case "in-progress":
    case "ongoing":
      return "text-blue-500";
    case "delayed":
      return "text-red-500";
    case "on schedule":
      return "text-teal-500";
    case "assigned":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};

// Helper function to get progress bar colors
const getProgressColors = (status: string) => {
  switch (status) {
    case "on schedule":
    case "in-progress":
    case "ongoing":
      return {
        bg: "bg-blue-200",
        bar: "bg-blue-500",
      };
    case "delayed":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    case "pending":
      return {
        bg: "bg-orange-200",
        bar: "bg-orange-500",
      };
    case "assigned":
      return {
        bg: "bg-purple-200",
        bar: "bg-purple-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};

const Queue: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData?.id;
  const [allRegisteredServices, setAllRegisteredService] = useState<
    AllRegisteredServices[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>(
    {}
  );
  const [deviceImages, setDeviceImages] = useState<Record<string, string[]>>(
    {}
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAllUserRegisteredServices(userId as string);
        console.log("data reached", result);
        if (result?.allRegisteredUserServices) {
          // Filter only incomplete/running services (exclude completed ones)
          const incompleteServices = result.allRegisteredUserServices.filter(
            (service: AllRegisteredServices) => 
              service.status !== "completed" && 
              service.status !== "cancelled" && 
              service.status !== "rejected"
          );
          
          setAllRegisteredService(incompleteServices);
          console.log(
            "Incomplete/Running services from the frontend:",
            incompleteServices
          );

          // Fetch images for each incomplete service
          if (incompleteServices.length > 0) {
            fetchServiceImages(incompleteServices);
          }
        }
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
  }, [userId]);

  // Fetch image URLs for all services
  const fetchServiceImages = async (services: AllRegisteredServices[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const service of services) {
      // Fetch service logo image from serviceDetails
      if (
        service.serviceDetails &&
        Array.isArray(service.serviceDetails) && 
        service.serviceDetails.length > 0 &&
        service.serviceDetails[0].imageKey
      ) {
        try {
          const imageResult = await getImageUrl(
            service.serviceDetails[0].imageKey,
            "service"
          );
          if (imageResult && imageResult.data && imageResult.data.url) {
            serviceImagesMap[service._id] = imageResult.data.url;
          }
        } catch (error) {
          console.error("Error fetching service image:", error);
        }
      }

      // Fetch device images from the image field
      if (service.image && service.image.length > 0) {
        const deviceImageUrls: string[] = [];

        for (const deviceImg of service.image) {
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
          deviceImagesMap[service._id] = deviceImageUrls;
        }
      }
    }

    setServiceImages(serviceImagesMap);
    setDeviceImages(deviceImagesMap);
  };

  // Define the columns for the service table with proper typing
  const serviceColumns: ColumnType<FormattedQueueData>[] = [
    {
      key: "service",
      header: "Service",
      render: (_, item) => (
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
      header: "User Name",
      render: (value) => <div className="font-medium">{String(value)}</div>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <div className="flex items-center">
          <Circle className={`${getStatusColor(String(value))} mr-2 h-4 w-4`} />
          <span className="capitalize">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "deviceImage",
      header: "Device Image",
      render: (_, item) => (
        <div className="flex">
          {deviceImages[item.id]?.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl || "/api/placeholder/40/40"}
              alt="device"
              className={`w-10 h-10 rounded-full border-2 border-blueGray-50 shadow ${
                idx > 0 ? "-ml-4" : ""
              }`}
            />
          )) || (
            <img
              src="/api/placeholder/40/40"
              alt="No device image"
              className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
            />
          )}
        </div>
      ),
    },
    {
      key: "completion",
      header: "Completion Status",
      render: (value, item) => (
        <div className="flex items-center">
          <span className="mr-2">{String(value)}%</span>
          <div className="relative w-full">
            <div
              className={`overflow-hidden h-2 text-xs flex rounded ${
                getProgressColors(item.status as string).bg
              }`}
            >
              <div
                style={{ width: `${value}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-black justify-center ${
                  getProgressColors(item.status as string).bar
                }`}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Transform your data to match the table structure with proper typing
  const formattedData: FormattedQueueData[] =
    allRegisteredServices.length > 0
      ? allRegisteredServices.map((service: AllRegisteredServices) => ({
          id: service._id,
          name: Array.isArray(service.serviceDetails) && service.serviceDetails.length > 0
            ? service.serviceDetails[0].name || "Unknown Service"
            : "Unknown Service",
          userName: service.name || "Unknown User",
          status: service.status || "pending",
          completion: service.completionPercentage || 0,
          originalData: service,
        }))
      : [];

  // Handle row click - Navigate to detail page
  const handleRowClick = (item: FormattedQueueData) => {
    console.log("Clicked on service:", item);
    navigate(`/user/registeredComplaintByUser/${item.id}`);
  };

  // Custom empty state for queue
  const QueueEmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mt-32 h-24 w-24 text-gray-400">
          <MdOutlineSpeakerNotesOff className="h-full w-full" />
        </div>
        <h3 className="mt-6 text-lg font-medium text-gray-900">
          No Active Services
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          You don't have any services currently in progress. All your services are either completed or you haven't registered any yet.
        </p>
      </div>
    </div>
  );

  // If no data is available and we're not loading, show the empty state
  if (!loading && allRegisteredServices.length === 0) {
    return (
      <div className="mt-16">
        <QueueEmptyState />
      </div>
    );
  }

  // Otherwise show the table with real data
  return (
    <DynamicTable<FormattedQueueData>
      title="Active Services Queue"
      columns={serviceColumns}
      data={loading ? [] : formattedData}
      loading={loading}
      emptyMessage="No active services in queue"
      onRowClick={handleRowClick}
      className="mt-16 cursor-pointer"
    />
  );
};

export default Queue;