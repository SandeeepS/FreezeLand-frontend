import StatusBadge from "./StatusBadge";

interface ComplaintDescriptionProps {
  description: string;
  status: string;
}

const ComplaintDescription = ({ description, status }: ComplaintDescriptionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Complaint Description</h2>
        <div className="mt-2 sm:mt-0">
          <StatusBadge status={status} />
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mt-2">
        <p className="text-gray-800 whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
};

export default ComplaintDescription;