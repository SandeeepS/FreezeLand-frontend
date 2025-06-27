import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ComplaintHeader from "./ComplaintHeader";
import ComplaintDescription from "./ComplaintDescription";
import ComplaintImages from "./ComplaintImages";
import ServiceDetails from "./ServiceDetails";
// import WorkDetails from "./WorkDetails";
import CustomerDetails from "./CustomerDetails";
import LocationDetails from "./LocationDetails";
import WorkHistory from "./WorkHistory";
import InvoiceDownloadButton from "../../../components/Common/generateInvoicePDF";
import { getComplaintById, getMechanicById } from "../../../Api/admin";
import {
  ICompliantData,
  IMechanicDetails,
  IOrderDetails,
} from "../../../interfaces/IPages/Admin/IAdminInterfaces";

const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<ICompliantData>();
  const [mechanicDetails, setMechanicDetails] = useState<IMechanicDetails>();
  const [orderdetails, setOrderDetails] = useState<IOrderDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getComplaintById(id as string);
        console.log("result from the backend is ", result);
        if (
          result?.data?.data?.complaint &&
          result.data.data.complaint.length > 0
        ) {
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

  useEffect(() => {
    console.log("complaints is ", complaint);
    if (complaint) {
      setOrderDetails(complaint.orderDetails[0]);
      console.log("orderdEtaisl is ", orderdetails);
    }
  }, [complaint, orderdetails]);

  // Fetch mechanic details when complaint is loaded
  useEffect(() => {
    const fetchMechanicDetails = async () => {
      if (!complaint?.currentMechanicId) return;

      try {
        const result = await getMechanicById(complaint.currentMechanicId);
        const mechanic = result?.data?.result;

        if (mechanic) {
          setMechanicDetails({
            ...mechanic,
            acceptedAt: complaint.acceptedAt,
          });
        }
      } catch (error) {
        console.error("Error fetching mechanic details:", error);
      }
    };

    fetchMechanicDetails();
  }, [complaint?.currentMechanicId, complaint?.acceptedAt]);

  // Calculate total amount from work details
  useEffect(() => {
    if (complaint?.workDetails && complaint.workDetails.length > 0) {
      const total = complaint.workDetails.reduce((sum, work) => {
        return sum + (work.amount || 0);
      }, 0);
      setTotalAmount(total);
    }
  }, [complaint?.workDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">
            Loading complaint details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Error Loading Complaint
          </h2>
          <p className="text-slate-600">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  // Check if payment is completed and invoice can be downloaded
  const isPaymentCompleted =
    complaint.status === "completed" && complaint.orderId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ComplaintHeader
            id={id as string}
            status={complaint.status}
            createdAt={complaint.createdAt}
            updatedAt={complaint.updatedAt}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
          <div className="flex-1 xl:flex-[2] space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
              <ComplaintDescription
                description={complaint.discription}
                status={complaint.status}
              />
            </div>

            {complaint.image && complaint.image.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
                <ComplaintImages images={complaint.image} />
              </div>
            )}

            {complaint.serviceDetails?.[0] && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
                <ServiceDetails serviceDetails={complaint.serviceDetails[0]} />
              </div>
            )}

            {/* {complaint.workDetails && complaint.workDetails.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
                <WorkDetails workDetails={complaint.workDetails} />
              </div>
            )} */}
          </div>

          <div className="flex-1 xl:flex-[1] xl:max-w-sm space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
              <CustomerDetails
                user={complaint.userDetails}
                name={complaint.name}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
              <LocationDetails
                location={complaint.locationName}
                defaultAddress={complaint.defaultAdressDetails}
              />
            </div>

            {complaint.workHistory && complaint.workHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-5">
                <WorkHistory
                  workHistory={complaint.workHistory}
                  currentMechanicId={complaint.currentMechanicId}
                />
              </div>
            )}
          </div>
        </div>

        {isPaymentCompleted && (
          <div className="mt-6 w-full">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-4 lg:p-6">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Invoice & Payment
                  </h3>
                  <p className="text-sm text-slate-600">
                    Service completed • Payment received
                  </p>
                </div>
              </div>

              {/* Payment Details Flex */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white rounded-lg p-3 border border-green-100 flex-1 min-w-[200px]">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {complaint.orderId}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 flex-1 min-w-[200px]">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total Amount
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    ₹{totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 flex-1 min-w-[200px]">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Payment Status
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                      Completed
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 flex items-center justify-center min-w-[200px]">
                  <InvoiceDownloadButton
                    complaint={complaint}
                    mechanicDetails={mechanicDetails}
                    totalAmount={orderdetails?.amount || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintDetailsPage;
