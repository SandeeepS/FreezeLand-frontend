import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById } from "../../../Api/admin";
import { ICompliantData } from "../../../interfaces/IPages/Admin/IAdminInterfaces";
import ComplaintHeader from "./ComplaintHeader";
import ComplaintDescription from "./ComplaintDescription";
import ComplaintImages from "./ComplaintImages";
import ServiceDetails from "./ServiceDetails";
import WorkDetails from "./WorkDetails";
import CustomerDetails from "./CustomerDetails";
import LocationDetails from "./LocationDetails";
import WorkHistory from "./WorkHistory";


const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<ICompliantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getComplaintById(id as string);
        
        if (result?.data?.data?.complaint && result.data.data.complaint.length > 0) {
          setComplaint(result.data.data.complaint[0]);
        } else {
          setError("Complaint not found");
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        setError("Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-700">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Complaint Header */}
        <ComplaintHeader 
          id={id as string}
          status={complaint.status}
          createdAt={complaint.createdAt}
          updatedAt={complaint.updatedAt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ComplaintDescription 
              description={complaint.discription}
              status={complaint.status}
            />
            
            <ComplaintImages images={complaint.image || []} />
            
            <ServiceDetails 
              serviceDetails={complaint.serviceDetails?.[0] || null}
            />
            
            <WorkDetails 
              workDetails={complaint.workDetails || []}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <CustomerDetails 
              user={complaint.userDetails}
              name={complaint.name || complaint.userDetails?.name}
            />
            
            <LocationDetails 
              location={complaint.locationName}
              defaultAddress={complaint.defaultAddressDetails?.[0]}
            />
            
            <WorkHistory 
              workHistory={complaint.workHistory || []}
              currentMechanicId={complaint.currentMechanicId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsPage;