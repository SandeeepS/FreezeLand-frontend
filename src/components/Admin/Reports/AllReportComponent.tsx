import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  User,
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileX,
  ExternalLink,
} from "lucide-react";
import {
  getAllReportsByReporterRole,
  updateReportStatus,
} from "../../../Api/admin";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Updated interface to match API response
interface ApiReport {
  _id: string;
  complaintId: string;
  reporterId: string;
  reporterRole: "user" | "mechanic";
  targetId: string;
  targetRole: "user" | "mechanic";
  reason: string;
  status?: "pending" | "in-progress" | "resolved"; // Added status field
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
}

// Transformed interface for UI display
interface Report {
  id: string;
  title: string;
  type: "user" | "mechanic";
  submittedBy: string;
  date: string;
  status: "pending" | "in-progress" | "resolved";
  category: string;
  shortDescription: string;
  fullDescription: string;
  targetRole: "user" | "mechanic";
  complaintId: string;
  reporterId: string;
  targetId: string;
}

const AllReportComponent: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());
  const { reportRole } = useParams();
  const navigate = useNavigate();

  console.log("ReporterType is ", reportRole);

  // Transform API data to UI format
  const transformApiDataToReport = (apiReport: ApiReport): Report => {
    return {
      id: apiReport._id,
      title: `Report against ${apiReport.targetRole}`,
      type: apiReport.reporterRole,
      submittedBy: `Reporter ID: ${apiReport.reporterId}`,
      date: apiReport.createdAt,
      status: apiReport.status || "pending", // Use API status or default to pending
      category: "General Report",
      shortDescription: apiReport.reason,
      fullDescription: `Report Details:\n\nReason: ${
        apiReport.reason
      }\nTarget: ${apiReport.targetRole} (ID: ${
        apiReport.targetId
      })\nComplaint ID: ${apiReport.complaintId}\nSubmitted: ${new Date(
        apiReport.createdAt
      ).toLocaleString()}`,
      targetRole: apiReport.targetRole,
      complaintId: apiReport.complaintId,
      reporterId: apiReport.reporterId,
      targetId: apiReport.targetId,
    };
  };

  const toggleRowExpansion = (reportId: string) => {
    const newExpandedRows = new Set(expandedRows);

    if (newExpandedRows.has(reportId)) {
      newExpandedRows.delete(reportId);
    } else {
      newExpandedRows.add(reportId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      // Add report to updating set
      setUpdatingStatus((prev) => new Set(prev).add(reportId));
      const result = await updateReportStatus(reportId, newStatus);
      console.log("result from the backend after updation is ", result);
      if (result?.data.success) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update local state only after successful API call
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId
              ? { ...report, status: newStatus as Report["status"] }
              : report
          )
        );

        console.log(
          `Successfully updated report ${reportId} status to ${newStatus}`
        );
      }else{
        console.log("updating failed ");
        toast.error("Updation of Status is failed");
      }
    } catch (error) {
      console.error(`Failed to update report ${reportId} status:`, error);
      toast.error(`Failed to update report status. Please try again.`);
    } finally {
      // Remove report from updating set
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  const handleViewComplaint = (complaintId: string) => {
    // Navigate to complaint details page
    navigate(`/admin/viewMoreComplaintDetails/${complaintId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Fetch the reports from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllReportsByReporterRole(
          reportRole as string
        );
        console.log("result in the frontend is ", response);

        if (response?.data?.result && Array.isArray(response.data.result)) {
          const transformedReports = response.data.result
            .filter((report: ApiReport) => !report.isDeleted) // Filter out deleted reports
            .map(transformApiDataToReport);
          setReports(transformedReports);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.log(
          "Error occurred while fetching the data from the backend in the AllReportComponent",
          error
        );
        setError("Failed to fetch reports. Please try again later.");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    if (reportRole) {
      fetchData();
    }
  }, [reportRole]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading reports...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error Loading Reports
              </h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 ml-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Reports -{" "}
            {reportRole
              ? reportRole.charAt(0).toUpperCase() + reportRole.slice(1)
              : "Unknown"}{" "}
            Reports
          </h1>
          <p className="text-gray-600">
            Manage and review all {reportRole} reports
          </p>
        </div>

        {/* No Data State */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Reports Found
            </h2>
            <p className="text-gray-600">
              There are no {reportRole} reports available at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Reports
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {reports.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {reports.filter((r) => r.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      In Progress
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {reports.filter((r) => r.status === "in-progress").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Resolved
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {reports.filter((r) => r.status === "resolved").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <React.Fragment key={report.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 mr-4">
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    report.type === "mechanic"
                                      ? "bg-blue-100"
                                      : "bg-green-100"
                                  }`}
                                >
                                  {report.type === "mechanic" ? (
                                    <Wrench className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <User className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {report.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {report.submittedBy}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {report.shortDescription}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {getStatusIcon(report.status)}
                              <span className="ml-1 capitalize">
                                {report.status.replace("-", " ")}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(report.id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              View More
                              {expandedRows.has(report.id) ? (
                                <ChevronUp className="w-4 h-4 ml-1" />
                              ) : (
                                <ChevronDown className="w-4 h-4 ml-1" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedRows.has(report.id) && (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-6 m-6">
                                {/* Report Description */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Full Description
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {report.fullDescription}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                  {/* View Complaint Button */}
                                  <button
                                    onClick={() =>
                                      handleViewComplaint(report.complaintId)
                                    }
                                    className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Complaint Details
                                  </button>

                                  {/* Status Update Section */}
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      Update Status:
                                    </span>
                                    <select
                                      value={report.status}
                                      onChange={(e) =>
                                        handleStatusUpdate(
                                          report.id,
                                          e.target.value
                                        )
                                      }
                                      disabled={updatingStatus.has(report.id)}
                                      className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in-progress">
                                        In Progress
                                      </option>
                                      <option value="resolved">Resolved</option>
                                    </select>
                                    {updatingStatus.has(report.id) && (
                                      <div className="inline-flex items-center px-3 py-1 text-sm text-gray-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                                        Updating...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllReportComponent;
