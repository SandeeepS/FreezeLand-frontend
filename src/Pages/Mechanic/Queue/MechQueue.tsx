import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DynamicTable, {
  ColumnType,
} from "../../../components/Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { getAllAcceptedServices, getImageUrl } from "../../../Api/mech";
import { AllAcceptedServices } from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";

interface FormattedService {
  id: string;
  name: string;
  userName: string;
  status: string;
  originalData: AllAcceptedServices;
  [key: string]: unknown;
}

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

const MechQueue: React.FC = () => {
  const navigate = useNavigate();
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.id;
  const [allAcceptedServices, setAllAcceptedServices] = useState<
    AllAcceptedServices[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>(
    {},
  );
  const [deviceImages, setDeviceImages] = useState<Record<string, string[]>>(
    {},
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mechanicId) return;
      try {
        setLoading(true);
        console.log("Fetching with params form the mechanicQueue componnet:", {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
        });
        const result = await getAllAcceptedServices(mechanicId as string, {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
        });
        console.log("data reached", result);
        if (result?.data.acceptedServices.allAcceptedServices) {
          setAllAcceptedServices(
            result.data.acceptedServices.allAcceptedServices,
          );
          console.log(
            "Accepted services:",
            result.data.acceptedServices.allAcceptedServices,
          );
          setTotalItems(result.data.acceptedServices.pagination.totalItems);
          setTotalPages(result.data.acceptedServices.pagination.totalPages);
          fetchAllImages(result.data.acceptedServices.allAcceptedServices);
        }
      } catch (error) {
        console.error(
          "Error occurred while fetching the accepted services:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mechanicId,currentPage, itemsPerPage, debouncedSearchQuery]);

  const fetchAllImages = async (services: AllAcceptedServices[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const service of services) {
      if (
        Array.isArray(service.serviceDetails) &&
        service.serviceDetails[0]?.imageKey
      ) {
        try {
          const imageResult = await getImageUrl(
            service.serviceDetails[0].imageKey,
            "service",
          );

          if (imageResult && imageResult.data && imageResult.data.url) {
            serviceImagesMap[service._id] = imageResult.data.url;
          }
        } catch (error) {
          console.error("Error fetching service image:", error);
        }
      }

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

  useEffect(() => {
    console.log("Accepted services from the frontend:", allAcceptedServices);
    console.log("Service images:", serviceImages);
    console.log("Device images:", deviceImages);
  }, [allAcceptedServices, serviceImages, deviceImages]);

  const serviceColumns: ColumnType<FormattedService>[] = [
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
  ];

  const formattedData: FormattedService[] =
    allAcceptedServices.length > 0
      ? allAcceptedServices.map((service: AllAcceptedServices) => ({
          id: service._id,
          name:
            Array.isArray(service.serviceDetails) &&
            service.serviceDetails[0]?.name
              ? service.serviceDetails[0].name
              : "Unknown Service",
          userName:
            Array.isArray(service.userDetails) && service.userDetails[0]?.name
              ? service.userDetails[0].name
              : service.name || "Unknown User",
          status: service.status || "pending",
          originalData: service,
        }))
      : [];

  const handleRowClick = (item: FormattedService) => {
    console.log("Clicked on service:", item);
    navigate(`/mech/complaintDetails/${item.id}`);
  };

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    console.log("Items per page changed to:", newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string): void => {
    console.log("Search query changed to:", query);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <DynamicTable<FormattedService>
      title="Accepted Services"
      columns={serviceColumns}
      data={loading ? [] : formattedData}
      loading={loading}
      emptyMessage="No services Accepted yet"
      onRowClick={handleRowClick}
      className="mt-16 cursor-pointer"
      paginationData={{
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
      }}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      onSearchChange={handleSearchChange}
      searchQuery={searchQuery}
    />
  );
};

export default MechQueue;
