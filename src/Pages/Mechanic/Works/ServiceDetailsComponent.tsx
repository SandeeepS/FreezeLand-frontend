// ServiceDetailsComponent.tsx
import React, { useEffect, useState } from "react";

import { getImageUrl } from "../../../Api/mech";
import TabsComponent from "./TabsComponent";

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
    image: string[];
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
  console.log("complaint details in the serviceDetailsComponnet ", complaint);
  const [serviceImage, setServiceImage] = useState<string>("");
  const [deviceImageUrls, setDeviceImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImage = async () => {
      if (complaint.serviceDetails && complaint.serviceDetails[0]?.imageKey) {
        const image = await getImageUrl(
          complaint.serviceDetails[0].imageKey,
          "mechService"
        );
        setServiceImage(image?.data.url);
      }
    };

    fetchImage();
  }, [complaint.serviceDetails]);

  useEffect(() => {
    console.log("Device images are ", complaint.image);
    const fetchImages = async () => {
      try {
        if (complaint.image && complaint.image.length > 0) {
          const urls: string[] = [];
          for (const key of complaint.image) {
            const imageRes = await getImageUrl(key, "complaintImage");
            if (imageRes?.data.url) {
              urls.push(imageRes.data.url);
            }
          }
          setDeviceImageUrls(urls);
        }
      } catch (error) {
        console.log("errror occured ", error);
      }
    };
    fetchImages();
  },[]);
  return (
    <div className="lg:col-span-2">
      <div className="bg-gray-200 rounded-lg shadow p-6 mb-6">
        <div className="flex items-start mb-4">
          <img
            src={serviceImage || "/api/placeholder/80/80"}
            alt={""}
            className="h-20 w-20 rounded-lg object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">
              {complaint.serviceDetails?.[0]?.name}
            </h2>
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

        {deviceImageUrls.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-3">Device Images</h3>
            <div className="md:flex md:space-x-3 space-y-3">
              {deviceImageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[160px] aspect-video bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={url || "/api/placeholder/400/300"}
                    alt={`Device image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs for worklog and details */}
      <TabsComponent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        complaint={complaint}
        formatDate={formatDate}
      />
    </div>
  );
};

export default ServiceDetailsComponent;
