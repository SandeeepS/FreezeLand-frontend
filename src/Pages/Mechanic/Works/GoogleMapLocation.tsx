import React from "react";
import {
  Map as GoogleMap,
  GoogleApiWrapper,
  IProvidedProps,
  Marker,
} from "google-maps-react";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

interface LocationProps {
  address: string;
  latitude: number;
  longitude: number;
}

interface MapContainerProps extends IProvidedProps {
  location: LocationProps;
}

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { google, location } = props;

  const mapStyles = {
    width: "100%",
    height: "300px",
    position: "relative", // Add this
  };

  const containerStyles = {
    position: "relative", // Add this
    width: "100%",
    height: "300px",
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-6 mb-6"
      style={{ position: "relative" }}
    >
      <div style={containerStyles}>
        <GoogleMap
          google={google}
          style={mapStyles}
          zoom={10}
          initialCenter={{
            lat: location.latitude,
            lng: location.longitude,
          }}
        />
        {/* Add a marker at the exact location */}
        <Marker
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
          // You can customize the marker with additional props if needed
          // title={location.address}
          // icon={{url: "custom-marker.png"}}
        />
      </div>
    </div>
  );
};

interface GoogleMapLocationProps {
  location: LocationProps;
}

const GoogleMapLocation = GoogleApiWrapper({
  apiKey: apiKey,
})(MapContainer);

export default GoogleMapLocation as React.ComponentType<GoogleMapLocationProps>;
