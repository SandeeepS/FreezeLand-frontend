interface LocationDetailsProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  defaultAddress: {
    name: string;
    email: string;
    phone: number;
    district: string;
    state: string;
    pin: number;
    landMark: string;
  } | null;
}

const LocationDetails = ({ location, defaultAddress }: LocationDetailsProps) => {
  console.log("Location details is ",location);
  console.log("default address",defaultAddress);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Location Information
      </h2>
      
      <div className="space-y-4">
        {/* Live location from map */}
        {location && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Service Location</p>
            <p className="font-medium text-gray-800">{location.address}</p>
            
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Latitude</p>
                <p className="font-medium">{location.latitude}</p>
              </div>
              <div>
                <p className="text-gray-500">Longitude</p>
                <p className="font-medium">{location.longitude}</p>
              </div>
            </div>
            
            {/* Map preview (placeholder - in a real app, you might use Google Maps) */}
            <div className="mt-3 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm mt-1">View on Google Maps</span>
                </div>
              </a>
            </div>
          </div>
        )}
        
        {/* Default address */}
        {defaultAddress && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Default Address</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800">{defaultAddress.name}</h3>
              <p className="text-gray-600 mt-1">{defaultAddress.landMark}</p>
              <p className="text-gray-600">
                {defaultAddress.district}, {defaultAddress.state} - {defaultAddress.pin}
              </p>
              <div className="mt-2 text-sm">
                <p className="text-gray-500">
                  <span className="font-medium">Phone:</span> {defaultAddress.phone}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Email:</span> {defaultAddress.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetails;