import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageUrl, getMechanicById } from "../../../../Api/admin";
import ApproveModal from "./ApproveModal"; // Import the modal component
import { MechData } from "../../../../interfaces/IComponents/Admin/IAdminInterfaces";

const MechanicVerify: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mechanic, setMechanic] = useState<MechData | null>(null);
  const [employeeLicense, setEmployeeLicense] = useState<string>("");
  const [adharProof, setAdharProof] = useState<string>("");
  const [photo,setPhoto] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<boolean>();
  const [hasInitiatedVerification, setHasInitiatedVerification] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      if (!id) {
        console.error("Mechanic ID is undefined");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch mechanic details
        const res = await getMechanicById(id);
        console.log("response from the backend in the MechVerify.tsx is ", res);
        const mechanicData = res?.data;
        setMechanic(mechanicData);

        if (mechanicData) {
          // Check if required fields exist and are not empty
          const hasRequiredFields =
            mechanicData.employeeLicense &&
            mechanicData.employeeLicense.trim() !== "" &&
            mechanicData.adharProof &&
            mechanicData.adharProof.trim() !== "" &&
            mechanicData.photo &&
            mechanicData.photo.trim() !== "";

          setHasInitiatedVerification(hasRequiredFields);

          if (hasRequiredFields) {
            // Fetch license and Aadhaar images concurrently only if fields exist
            const [photo,licenseImage, adharImage] = await Promise.all([
              getImageUrl(mechanicData.photo,"photo"),
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
            if(photo?.data.url){
              setPhoto(photo.data.url)
            }

            console.log("Fetched License and Aadhaar URLs:", {
              license: licenseImage?.data?.url,
              adhar: adharImage?.data?.url,
            });
          }

          setVerificationStatus(mechanicData.isVerified);
          console.log(
            "Current status of Mechanic verified or not is",
            mechanicData.isVerified
          );
        }
      } catch (error) {
        console.error("Error fetching mechanic details or images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMechanicDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">Unable to fetch mechanic details</p>
        </div>
      </div>
    );
  }

  // If mechanic hasn't initiated verification process
  if (!hasInitiatedVerification) {
    return (
      <div className="p-6 m-4 bg-white shadow-lg rounded-lg h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">
          Mechanic Verification
        </h1>

        {/* Basic Mechanic Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{mechanic.name}</h2>
          <p className="text-gray-600">{mechanic.email}</p>
        </div>

        {/* Not Initiated Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Verification Not Initiated
              </h3>
              <p className="text-yellow-700">
                Mechanic has not initiated the verification process. The
                following documents are required:
              </p>
              <ul className="list-disc list-inside mt-2 text-yellow-700">
                <li>Employee License</li>
                <li>Aadhaar Proof</li>
                <li>Profile Photo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  m-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Mechanic Verification
      </h1>

      {/* Mechanic Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image */}
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-md">
          <img
            src={photo}
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
            {employeeLicense ? (
              <>
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
              </>
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            )}
          </div>

          {/* Aadhaar */}
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Aadhaar</h3>
            {adharProof ? (
              <>
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
              </>
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            )}
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
        id={id}
        verifyStatus={verificationStatus}
      />
    </div>
  );
};

export default MechanicVerify;
