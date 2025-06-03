import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../../../components/Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import {  getAllCompletedServices, getImageUrl } from "../../../Api/mech";
import {
  AllAcceptedServices,
  TableColumn,
} from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";

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

const ServiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.id;
  const [completedServices, setCompletedServices] = useState<
    AllAcceptedServices[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Add state for storing image URLs
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [deviceImages, setDeviceImages] = useState<Record<string, string[]>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAllCompletedServices(mechanicId as string);
        console.log("data reached", result);
        if (result?.data?.result) {
          setCompletedServices(result.data.result);
          console.log("Completed services:", result.data.result);
          // Fetch images for services and devices
          fetchAllImages(result.data.result);
        }
      } catch (error) {
        console.error(
          "Error occurred while fetching the completed services:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mechanicId]);
  
  // Fetch image URLs for all services and devices
  const fetchAllImages = async (services: AllAcceptedServices[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const service of services) {
      // Fetch service logo image from serviceDetails
      const serviceDetailsArr = Array.isArray(service.serviceDetails) ? service.serviceDetails : [];
      if (serviceDetailsArr.length > 0 && serviceDetailsArr[0]?.imageKey) {
        try {
          const imageResult = await getImageUrl(
            serviceDetailsArr[0].imageKey,
            "service"
          );

          if (imageResult && imageResult.data && imageResult.data.url) {
            serviceImagesMap[service._id] = imageResult.data.url;
          }
          
        } catch (error) {
          console.error("Error fetching service image:", error);
        }
      }

      // Fetch device images if available
      if (service.image && service.image.length) {
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
      render: (_, item) => (
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
    {
      key: "completionDate",
      header: "Completion Date",
      render: (value) => (
        <div className="flex items-center">
          {value ? new Date(value).toLocaleDateString() : "N/A"}
        </div>
      ),
    },
  ];

  // Transforming the data to match the table structure
  const formattedData =
    completedServices.length > 0
      ? completedServices.map((service: any) => ({
          id: service._id,
          name: service.serviceDetails?.[0]?.name || "Unknown Service",
          userName:
            service.userDetails?.[0]?.name || service.name || "Unknown User",
          status: service.status || "completed",
          completionDate: service.completionDate || service.updatedAt,
          originalData: service,
        }))
      : [];

  const handleRowClick = (item: any) => {
    console.log("Clicked on service:", item);
    navigate(`/mech/serviceDetails/${item.id}`);
  };

  return (
    <DynamicTable
      title="Service History"
      columns={serviceColumns}
      data={formattedData}
      loading={loading}
      emptyMessage="No completed services found"
      onRowClick={handleRowClick}
      className="mt-16 cursor-pointer"
    />
  );
};

export default ServiceHistory;