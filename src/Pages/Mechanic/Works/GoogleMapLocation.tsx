import React from 'react';
import { Map, GoogleApiWrapper, MapProps, IProvidedProps } from 'google-maps-react';
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;


interface LocationProps {
  latitude: number;
  longitude: number;
}

interface MapContainerProps extends IProvidedProps {
  location: LocationProps;
}

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { google, location } = props;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <Map 
        google={google}
        style={{ width: "100%", height: "300px" }}
        zoom={10}
        initialCenter={{
          lat: location.latitude,
          lng: location.longitude
        }}
      />
    </div>
  );
};

interface GoogleMapLocationProps {
  location: LocationProps;
}

const GoogleMapLocation = GoogleApiWrapper({
  apiKey: apiKey
})(MapContainer);

export default GoogleMapLocation as React.ComponentType<GoogleMapLocationProps>;