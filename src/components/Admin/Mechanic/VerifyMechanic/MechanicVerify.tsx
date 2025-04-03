import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageUrl, getMechanicById } from "../../../../Api/admin";
import ApproveModal from "./ApproveModal"; // Import the modal component

interface MechData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  employeeLicense: string; 
  adharProof: string; 
  image: string; 
}

const MechanicVerify: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mechanic, setMechanic] = useState<MechData | null>(null);
  const [employeeLicense, setEmployeeLicense] = useState<string>("");
  const [adharProof, setAdharProof] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [verificationStatus,setVerificationStatus] = useState<boolean>();

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      if (!id) {
        console.error("Mechanic ID is undefined");
        return;
      }

      try {
        // Fetch mechanic details
        const res = await getMechanicById(id);
        const mechanicData = res?.data;
        setMechanic(mechanicData);

        // Fetch license and Aadhaar images concurrently
        if (mechanicData) {
          const [licenseImage, adharImage] = await Promise.all([
            getImageUrl(mechanicData.employeeLicense, "license"),
            getImageUrl(mechanicData.adharProof, "adhar"),
          ]);

          // Set the fetched image URLs
          if (licenseImage?.data?.url) {
            setEmployeeLicense(licenseImage.data.url);
          }
          if (adharImage?.data?.url) {
            setAdharProof(adharImage.data.url);
          }

          console.log("Fetched License and Aadhaar URLs:", {
            license: licenseImage?.data?.url,
            adhar: adharImage?.data?.url,
          });
          setVerificationStatus(mechanicData.isVerified);
          console.log("Current status of Mechanic verified or not is",verificationStatus);
        }
      } catch (error) {
        console.error("Error fetching mechanic details or images:", error);
      }
    };

    fetchMechanicDetails();
  }, [id]);

  if (!mechanic) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Mechanic Verification
      </h1>

      {/* Mechanic Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image */}
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-md">
          <img
            src={mechanic.image}
            alt={`${mechanic.name}'s Profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mechanic Details */}
        <div className="flex-1">
          <p className="text-lg">
            <strong>Name:</strong> {mechanic.name}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {mechanic.email}
          </p>
          <p className="text-lg">
            <strong>Phone:</strong> {mechanic.phone}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {mechanic.role}
          </p>
          <p className="text-lg">
            <strong>Blocked:</strong> {mechanic.isBlocked ? "Yes" : "No"}
          </p>
          <p className="text-lg">
            <strong>Verified:</strong> {mechanic.isVerified ? "Yes" : "No"}
          </p>
          <p className="text-lg">
            <strong>Deleted:</strong> {mechanic.isDeleted ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Documents Portion */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License */}
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">License</h3>
            <img
              src={employeeLicense}
              alt="License"
              className="w-full h-40 object-cover rounded-md"
            />
            <a
              href={employeeLicense}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 block"
            >
              View Full Image
            </a>
          </div>

          {/* Aadhaar */}
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Aadhaar</h3>
            <img
              src={adharProof}
              alt="Aadhaar"
              className="w-full h-40 object-cover rounded-md"
            />
            <a
              href={adharProof}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 block"
            >
              View Full Image
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => setIsModalOpen(true)} // Open the modal
        >
          Approve
        </button>
        {/* <button
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => console.log("Mechanic Rejected")}
        >
          Reject
        </button> */}
      </div>

      {/* Approve Modal */}
      <ApproveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        id = {id}
        verifyStatus = {verificationStatus}
      />
    </div>
  );
};

export default MechanicVerify;