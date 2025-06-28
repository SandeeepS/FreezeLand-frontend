import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComplaintDetails, getImageUrl } from "../../../Api/mech";
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  UserCheck,
  // IndianRupee,
  // Hammer,
  History,
} from "lucide-react";

// Define interfaces for type safety
interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phone: number;
  profile_picture?: string;
}

interface ServiceDetail {
  serviceName?: string;
  category?: string;
  subCategory?: string;
}

interface WorkDetail {
  workStartTime?: string;
  workEndTime?: string;
  workDescription?: string;
  partsUsed?: string[];
  laborCost?: number;
  partsCost?: number;
  totalCost?: number;
}

interface WorkHistoryItem {
  status: string;
  timestamp: string;
  mechanicId?: string;
}

interface LocationName {
  address: string;
  latitude: number;
  longitude: number;
}

interface DefaultAddressDetail {
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Complaint {
  _id: string;
  chatId: string;
  createdAt: string;
  currentMechanicId: string;
  defaultAddress: string;
  defaultAddressDetails: DefaultAddressDetail[];
  discription: string;
  image: string[];
  isBlocked: boolean;
  isDeleted: boolean;
  locationName: LocationName;
  name: string;
  needsReassignment: boolean;
  orderId: string;
  serviceDetails: ServiceDetail[];
  serviceId: string;
  status: string;
  updatedAt: string;
  userCancellation: {
    canceledAt: string | null;
    reason: string | null;
  };
  userDetails: UserDetails;
  userId: string;
  workDetails: WorkDetail[];
  workHistory: WorkHistoryItem[];
}

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string>("");
  const [serviceImageUrls, setServiceImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No complaint ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getComplaintDetails(id);

        if (result?.data?.result?.[0]) {
          setComplaint(result.data.result[0]);
          console.log("Result from the backend is:", result);
        } else {
          setError("No complaint data found");
        }
      } catch (error) {
        console.error(
          "Error while getting complaint details from the backend:",
          error
        );
        setError("Failed to fetch complaint details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const data = complaint?.userDetails.profile_picture;
        const result = await getImageUrl(data as string, "mechanic");
        setImage(result?.data.url);
      } catch (error) {
        console.log("Error while getImageUrl", error);
      }
    };
    getImage();
  }, [complaint]);

  useEffect(() => {
    const fetchServiceImages = async () => {
      if (!complaint?.image || complaint.image.length === 0) {
        setServiceImageUrls([]);
        return;
      }
      try {
        const urls = await Promise.all(
          complaint.image.map(async (imgKey) => {
            try {
              const result = await getImageUrl(imgKey, "mechanic");
              return result?.data?.url || ""; 
            } catch {
              return ""; 
            }
          })
        );
        setServiceImageUrls(urls.filter(Boolean));
      } catch (error) {
        console.log("Error fetching service images", error);
        setServiceImageUrls([]);
      }
    };
    fetchServiceImages();
  }, [complaint]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address: string) => {
    if (address.length > 100) {
      return address.substring(0, 100) + "...";
    }
    return address;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "assigned":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Error Loading Service Details
          </h2>
          <p className="text-gray-500">
            {error || "Service details not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Service Request Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: {complaint.orderId}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full border flex items-center gap-2 w-fit ${getStatusColor(
                complaint.status
              )}`}
            >
              {getStatusIcon(complaint.status)}
              <span className="font-medium capitalize">{complaint.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">
                {formatDate(complaint.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Updated:</span>
              <span className="font-medium">
                {formatDate(complaint.updatedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">
                {complaint.serviceDetails?.[0]?.serviceName ||
                  "Service Request"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {complaint.userDetails.profile_picture ? (
                    <img
                      src={image}
                      alt="{complaint.userDetails.name}"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {complaint.userDetails.name}
                  </p>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>

              <div className="pl-15 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {complaint.userDetails.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {complaint.userDetails.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-green-600" />
              Service Information
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Service Category:</span>
                <p className="font-medium text-gray-900">
                  {complaint.serviceDetails?.[0]?.category || "General Service"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sub Category:</span>
                <p className="font-medium text-gray-900">
                  {complaint.serviceDetails?.[0]?.subCategory || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Service ID:</span>
                <p className="font-medium text-gray-900 text-xs">
                  {complaint.serviceId}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Mechanic ID:</span>
                <p className="font-medium text-gray-900 text-xs">
                  {complaint.currentMechanicId}
                </p>
              </div>
            </div>
          </div>*/}
        </div> 

        {/* Problem Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Problem Description
          </h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {complaint.discription}
          </p>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Service Location
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="text-gray-900">
                {formatAddress(complaint.locationName.address)}
              </p>
            </div>

            {complaint.defaultAddressDetails?.[0] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <span className="text-sm text-gray-500">City:</span>
                  <p className="font-medium text-gray-900">
                    {complaint.defaultAddressDetails[0].city || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">State:</span>
                  <p className="font-medium text-gray-900">
                    {complaint.defaultAddressDetails[0].state || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Pincode:</span>
                  <p className="font-medium text-gray-900">
                    {complaint.defaultAddressDetails[0].pincode || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-sm text-gray-500">Latitude:</span>
                <p className="font-medium text-gray-900">
                  {complaint.locationName.latitude}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Longitude:</span>
                <p className="font-medium text-gray-900">
                  {complaint.locationName.longitude}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {serviceImageUrls.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Service Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceImageUrls.map((url, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 flex items-center justify-center bg-gray-100 h-48"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Service Image ${index + 1}`}
                      className="object-contain h-full w-full rounded"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Details */}
        {/* {complaint.workDetails && complaint.workDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-indigo-600" />
              Work Details
            </h2>

            {complaint.workDetails.map((work, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Work Description:
                    </span>
                    <p className="text-gray-900">
                      {work.workDescription || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Parts Used:</span>
                    <p className="text-gray-900">
                      {work.partsUsed?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <span className="text-sm text-gray-500">Start Time:</span>
                    <p className="font-medium text-gray-900">
                      {work.workStartTime
                        ? formatDate(work.workStartTime)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">End Time:</span>
                    <p className="font-medium text-gray-900">
                      {work.workEndTime ? formatDate(work.workEndTime) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Labor Cost:</span>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {work.laborCost || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total Cost:</span>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {work.totalCost || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Work History */}
        {complaint.workHistory && complaint.workHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              Work History
            </h2>

            <div className="space-y-4">
              {complaint.workHistory.map((history, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${getStatusColor(
                      history.status
                    )}`}
                  >
                    {getStatusIcon(history.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {history.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(history.timestamp)}
                    </p>
                  </div>
                  {history.mechanicId && (
                    <div className="text-xs text-gray-500">
                      Mechanic: {history.mechanicId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
