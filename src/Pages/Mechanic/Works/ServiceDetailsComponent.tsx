// ServiceDetailsComponent.tsx
import React, { useEffect, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEditable } from "@chakra-ui/react";
import { getImageUrl } from "../../../Api/mech";

interface ServiceDetailsProps {
  complaint: {
    name: string;
    serviceDetails?: {
        name: string;
        imageKey: string;
        discription: string[];
        serviceCharge: number;
        createdAt: Date;
    }[];
    discription: string;
    notes?: string[];
    deviceImages?: string[];
    createdAt: string;
    lastUpdated?: string;
    estimatedCompletionDate?: string;
    completionPercentage: number;
    status: string;
    workHistory?: {
      date: string;
      action: string;
      notes: string;
      completionPercentage: number;
    }[];
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formatDate: (dateString: string) => string;
}

const ServiceDetailsComponent: React.FC<ServiceDetailsProps> = ({
  complaint,
  activeTab,
  setActiveTab,
  formatDate,
}) => {

    const [serviceImage, setServiceImage] = useState<string>("");

    useEffect(() => {
      const fetchImage = async () => {
        if (complaint.serviceDetails && complaint.serviceDetails[0]?.imageKey) {
          const image = await getImageUrl(complaint.serviceDetails[0].imageKey, "mechService");
          setServiceImage(image?.data.url);
        }
      };
      
      fetchImage();
    }, [complaint.serviceDetails]);
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start mb-4">
          <img
            src={
              serviceImage ||
              "/api/placeholder/80/80"
            }
            alt={""}
            className="h-20 w-20 rounded-lg object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">{complaint.serviceDetails?.[0]?.name}</h2>
            <p className="text-gray-600 mt-1">
              {complaint.serviceDetails?.[0]?.discription ||
                "No service description available"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-semibold text-lg mb-2">
            Service Request Description
          </h3>
          <p className="text-gray-700">{complaint.discription}</p>
        </div>

        {complaint.notes && complaint.notes.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-2">Notes</h3>
            <ul className="list-disc list-inside text-gray-700">
              {complaint.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {complaint.deviceImages && complaint.deviceImages.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-3">Device Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.deviceImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={image || "/api/placeholder/400/300"}
                    alt={`Device image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs for worklog and details */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Service Details
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "worklog"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("worklog")}
            >
              Work History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" ? (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-3">Service Timeline</h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <CalendarTodayIcon className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-gray-600">
                        {formatDate(complaint.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <CalendarTodayIcon className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-gray-600">
                        {formatDate(
                          complaint.lastUpdated || complaint.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <CalendarTodayIcon className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Estimated Completion</p>
                      <p className="text-gray-600">
                        {formatDate(complaint.estimatedCompletionDate || "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Progress</h3>
                <div className="flex items-center">
                  <span className="mr-2">
                    {complaint.completionPercentage}%
                  </span>
                  <div className="relative w-full">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{
                          width: `${complaint.completionPercentage}%`,
                        }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          complaint.status === "completed"
                            ? "bg-emerald-500"
                            : complaint.status === "delayed"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-3">Work History</h3>
              {complaint.workHistory && complaint.workHistory.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {complaint.workHistory.map((workItem, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== complaint.workHistory!.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  index === complaint.workHistory!.length - 1 &&
                                  complaint.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                              >
                                {index === complaint.workHistory!.length - 1 &&
                                complaint.status === "completed" ? (
                                  <CheckCircleIcon className="h-5 w-5 text-white" />
                                ) : (
                                  <BuildIcon className="h-5 w-5 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {workItem.action}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {workItem.notes}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Progress: {workItem.completionPercentage}%
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {formatDate(workItem.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No work history available yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsComponent;
