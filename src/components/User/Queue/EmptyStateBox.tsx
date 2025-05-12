import { AlertCircle } from "lucide-react";

const EmptyStateBox = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-24 flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Registered</h3>
      <p className="text-gray-600 max-w-md">
        You currently don't have any registered complaints or service requests. 
        When you register a service, it will appear here.
      </p>
    </div>
  );
};

export default EmptyStateBox
