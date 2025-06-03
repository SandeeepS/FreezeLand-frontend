import React from "react";
import { FileText, Wrench, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SelectReportComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleReportSelection = (reportRole: "mechanic" | "user") => {
    navigate(`/admin/showAllreports/${reportRole}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Report
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Choose the type of reports you want to view.
          </p>
        </div>

        {/* Report Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mechanic Reports */}
          <div
            onClick={() => handleReportSelection("mechanic")}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 group"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Mechanic Reports
              </h2>

              <p className="text-gray-600 leading-relaxed mb-4">
                Access technical reports, maintenance logs, repair histories,
                and diagnostic information from mechanics and service personnel.
              </p>
            </div>
          </div>

          {/* User Reports */}
          <div
            onClick={() => handleReportSelection("user")}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-green-300 group"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                User Reports
              </h2>

              <p className="text-gray-600 leading-relaxed mb-4">
                View user feedback, complaints, service requests, and customer
                experience reports to improve service quality.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Select an option above to view the corresponding reports and
            analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectReportComponent;
