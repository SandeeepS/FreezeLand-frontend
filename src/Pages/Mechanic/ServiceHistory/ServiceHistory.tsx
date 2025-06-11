import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DynamicTable, {
  ColumnType,
} from "../../../components/Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { getAllCompletedServices, getImageUrl } from "../../../Api/mech";
import { AllAcceptedServices } from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";

// Define the exact shape of your table data (similar to FormattedComplaintData)
export interface FormattedServiceData {
  id: string;
  name: string;
  userName: string;
  status: string;
  completionDate: Date;
  originalData: AllAcceptedServices;
  service: string; // Add this for the service column
  deviceImage: string; // Add this for the device image column
  [key: string]: unknown;
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

const ServiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.id;
  const [completedServices, setCompletedServices] = useState<
    AllAcceptedServices[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add state for storing image URLs
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
      const serviceDetailsArr = Array.isArray(service.serviceDetails)
        ? service.serviceDetails
        : [];
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

  // Define the columns using ColumnType from DynamicTable (like in AllWorksPage)
  const serviceColumns: ColumnType<FormattedServiceData>[] = [
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
      header: "User Name",
      render: (value) => <div className="font-medium">{String(value)}</div>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <div className="flex items-center">
          <Circle
            className={`${getStatusColor(value as string)} mr-2 h-4 w-4`}
          />
          {String(value)}
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
          {value instanceof Date && !isNaN((value as Date).getTime())
            ? (value as Date).toLocaleDateString()
            : "N/A"}
        </div>
      ),
    },
  ];

  // Transform data for the table with proper typing (like in AllWorksPage)
  const formattedData: FormattedServiceData[] =
    completedServices.length > 0
      ? completedServices.map((service: AllAcceptedServices) => ({
          id: service._id,
          name:
            (Array.isArray(service.serviceDetails) &&
              service.serviceDetails[0]?.name) ||
            "Unknown Service",
          userName:
            (Array.isArray(service.userDetails) &&
              service.userDetails[0]?.name) ||
            service.name ||
            "Unknown User",
          status: service.status || "completed",
          completionDate: service.updatedAt
            ? new Date(service.updatedAt)
            : new Date(),
          originalData: service,
          service:
            (Array.isArray(service.serviceDetails) &&
              service.serviceDetails[0]?.name) ||
            "Unknown Service", // Add this
          deviceImage:
            Array.isArray(service.image) &&
            service.image.length > 0 &&
            service.image &&
            typeof service.image === "string"
              ? service.image[0]
              : "", // Always a string
        }))
      : [];

  const handleRowClick = (item: FormattedServiceData) => {
    console.log("Clicked on service:", item);
    navigate(`/mech/serviceDetails/${item.id}`);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Service History</h1>
      <DynamicTable<FormattedServiceData>
        title="Completed Services"
        columns={serviceColumns}
        data={formattedData}
        loading={loading}
        emptyMessage="No completed services found"
        onRowClick={handleRowClick}
        className="cursor-pointer"
      />
    </div>
  );
};

export default ServiceHistory;
