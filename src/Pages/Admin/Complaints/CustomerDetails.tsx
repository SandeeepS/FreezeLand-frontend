interface CustomerDetailsProps {
  user: {
    profile_picture?: string;
    email: string;
    phone: string;
    role?: string;
    isBlocked?: boolean;
  };
  name: string;
}

const CustomerDetails = ({ user, name }: CustomerDetailsProps) => {
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Customer Information
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center">
          {user.profile_picture ? (
            <img 
              src={user.profile_picture} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover mr-4" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm">Customer</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">{user.phone}</p>
          </div>
          
          {user.role && (
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-800 capitalize">{user.role}</p>
            </div>
          )}
          
          {user.isBlocked !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;