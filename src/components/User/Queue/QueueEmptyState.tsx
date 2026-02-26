import { MdOutlineSpeakerNotesOff } from "react-icons/md";

type EmptyStateBoxProp ={
    searchQuery : string 
}
const QueueEmptyState = (searchQuery : EmptyStateBoxProp) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mt-32 h-24 w-24 text-gray-400">
          <MdOutlineSpeakerNotesOff className="h-full w-full" />
        </div>
        <h3 className="mt-6 text-lg font-medium text-gray-900">
          No Active Services
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {searchQuery
            ? `No services found matching "${searchQuery}"`
            : "You don't have any services currently in progress. All your services are either completed or you haven't registered any yet."}
        </p>
      </div>
    </div>
  );
};

export default QueueEmptyState;
