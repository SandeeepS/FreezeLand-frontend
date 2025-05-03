import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUserRegisteredServices, getImageUrl } from "../../../Api/user";
import DynamicTable from "../../Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import {
  AllRegisteredServices,
  TableColumn,
} from "../../../interfaces/IComponents/User/IUserInterfaces";
import EmptyStateBox from "./EmptyStateBox";

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
          setAllRegisteredService(result.allRegisteredUserServices);
          console.log(
            "Registered services from the frontend:",
            result.allRegisteredUserServices
          );

          // Fetch images for each service
          fetchServiceImages(result.allRegisteredUserServices);
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

  // Define the columns for the service table
  const serviceColumns: TableColumn[] = [
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
          id: service._id,
          name: service.serviceDetails[0]?.name || "Unknown Service",
          userName: service.name || "Unknown User",
          status: service.status || "pending",
          completion: service.completionPercentage || 0,
          originalData: service,
        }))
      : [];

  // Handle row click - Navigate to detail page
  const handleRowClick = (item: any) => {
    console.log("Clicked on service:", item);
    navigate(`/user/registeredComplaintByUser/${item.id}`);
  };

  // If no data is available and we're not loading, show the empty state
  if (!loading && allRegisteredServices.length === 0) {
    return (
      <div className="mt-16">
        <EmptyStateBox />
      </div>
    );
  }

  // Otherwise show the table with real data
  return (
    <DynamicTable
      title="Registered Services"
      columns={serviceColumns}
      data={loading ? [] : formattedData}
      loading={loading}
      emptyMessage="No services registered yet"
      onRowClick={handleRowClick}
      className="mt-16 cursor-pointer" // Added cursor-pointer to indicate clickable rows
    />
  );
};

export default Queue;
