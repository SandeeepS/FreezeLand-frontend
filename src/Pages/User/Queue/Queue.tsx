import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUserRegisteredServices, getImageUrl } from "../../../Api/user";
import DynamicTable, {
  ColumnType,
} from "../../../components/Common/DynamicTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { AllRegisteredServices } from "../../../interfaces/IComponents/User/IUserInterfaces";
import QueueEmptyState from "../../../components/User/Queue/QueueEmptyState";

interface FormattedQueueData {
  id: string;
  name: string;
  userName: string;
  status: string;
  completion: number;
  originalData: AllRegisteredServices;
  [key: string]: unknown;
}

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

const Queue: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData?.id;
  const [allRegisteredServices, setAllRegisteredService] = useState<
    AllRegisteredServices[]
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
      if (!userId) return;

      try {
        setLoading(true);

        console.log("Fetching with params:", {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
        });

        const result = await getAllUserRegisteredServices(userId as string, {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
        });

        console.log("API Response:", result);

        if (result?.allRegisteredUserServices?.allRegisteredUserServices) {
          const incompleteServices =
            result.allRegisteredUserServices.allRegisteredUserServices.filter(
              (service: AllRegisteredServices) =>
                service.status !== "completed" &&
                service.status !== "cancelled" &&
                service.status !== "rejected",
            );

          setAllRegisteredService(incompleteServices);
          console.log(
            "Incomplete/Running services from the frontend:",
            incompleteServices,
          );

          setTotalItems(
            result.allRegisteredUserServices.pagination?.totalItems || 0,
          );
          setTotalPages(
            result.allRegisteredUserServices.pagination?.totalPages || 0,
          );

          if (incompleteServices.length > 0) {
            fetchServiceImages(incompleteServices);
          }
        }
      } catch (error) {
        console.error(
          "Error occurred while fetching the registered services:",
          error,
        );
        setAllRegisteredService([]);
        setTotalItems(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, currentPage, itemsPerPage, debouncedSearchQuery]);

  const fetchServiceImages = async (services: AllRegisteredServices[]) => {
    const serviceImagesMap: Record<string, string> = {};
    const deviceImagesMap: Record<string, string[]> = {};

    for (const service of services) {
      if (
        service.serviceDetails &&
        Array.isArray(service.serviceDetails) &&
        service.serviceDetails.length > 0 &&
        service.serviceDetails[0].imageKey
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
  ];

  const formattedData: FormattedQueueData[] =
    allRegisteredServices.length > 0
      ? allRegisteredServices.map((service: AllRegisteredServices) => ({
          id: service._id,
          name:
            Array.isArray(service.serviceDetails) &&
            service.serviceDetails.length > 0
              ? service.serviceDetails[0].name || "Unknown Service"
              : "Unknown Service",
          userName: service.name || "Unknown User",
          status: service.status || "pending",
          completion: service.completionPercentage || 0,
          originalData: service,
        }))
      : [];

  const handleRowClick = (item: FormattedQueueData) => {
    console.log("Clicked on service:", item);
    navigate(`/user/registeredComplaintByUser/${item.id}`);
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

  if (!loading && allRegisteredServices.length === 0) {
    return (
      <div className="mt-16">
        <QueueEmptyState searchQuery={searchQuery} />
      </div>
    );
  }

  return (
    <DynamicTable<FormattedQueueData>
      title="Active Services Queue"
      columns={serviceColumns}
      data={loading ? [] : formattedData}
      loading={loading}
      emptyMessage="No active services in queue"
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

export default Queue;
