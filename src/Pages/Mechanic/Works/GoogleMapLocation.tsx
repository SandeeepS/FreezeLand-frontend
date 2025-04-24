import React, { useState, useEffect } from "react";
import {
  Map as GoogleMap,
  GoogleApiWrapper,
  IProvidedProps,
  Marker,
  InfoWindow,
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

interface DistanceInfo {
  distance: string;
  duration: string;
  loading: boolean;
  error: string | null;
}

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { google, location } = props;
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<DistanceInfo>({
    distance: "",
    duration: "",
    loading: true,
    error: null,
  });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState<any>(null);

  const mapStyles = {
    width: "100%",
    height: "300px",
    position: "relative" as const,
  };

  const containerStyles = {
    position: "relative" as const,
    width: "100%",
    height: "300px",
  };

  // Get current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
          setDistanceInfo((prev) => ({
            ...prev,
            loading: false,
            error:
              "Unable to get your current location. Please enable location services.",
          }));
        }
      );
    } else {
      setDistanceInfo((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      }));
    }
  }, []);

  // Calculate distance and duration when current position is available
  useEffect(() => {
    if (
      !currentPosition ||
      !google ||
      !location.latitude ||
      !location.longitude
    )
      return;

    const calculateDistanceAndDuration = () => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: new google.maps.LatLng(
            currentPosition.lat,
            currentPosition.lng
          ),
          destination: new google.maps.LatLng(
            location.latitude,
            location.longitude
          ),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            if (route && route.legs.length > 0) {
              const leg = route.legs[0];
              setDistanceInfo({
                distance: leg.distance.text,
                duration: leg.duration.text,
                loading: false,
                error: null,
              });
            }
          } else {
            setDistanceInfo({
              distance: "",
              duration: "",
              loading: false,
              error: "Unable to calculate distance and duration.",
            });
          }
        }
      );
    };

    calculateDistanceAndDuration();
  }, [currentPosition, google, location]);

  const handleMarkerClick = (props: any, marker: any) => {
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  const handleInfoWindowClose = () => {
    setShowInfoWindow(false);
    setActiveMarker(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">Location Map</h3>
      <div style={containerStyles}>
        <GoogleMap
          google={google}
          style={mapStyles}
          zoom={13}
          initialCenter={{
            lat: location.latitude,
            lng: location.longitude,
          }}
        >
          {/* Destination marker */}
          <Marker
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            title="Destination"
            name={location.address}
            onClick={handleMarkerClick}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />

          {/* Current position marker */}
          {currentPosition && (
            <Marker
              position={currentPosition}
              title="Your Location"
              name="Your Current Location"
              onClick={handleMarkerClick}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          <InfoWindow
            marker={activeMarker}
            visible={showInfoWindow}
            onClose={handleInfoWindowClose}
          >
            <div className="p-2">
              <h4 className="font-semibold">{activeMarker?.name || ""}</h4>
            </div>
          </InfoWindow>
        </GoogleMap>
      </div>

      {/* Distance and duration information */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        {distanceInfo.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <span>Calculating distance and travel time...</span>
          </div>
        ) : distanceInfo.error ? (
          <div className="text-red-500">{distanceInfo.error}</div>
        ) : (
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="font-medium">Distance: </span>
              <span className="ml-1">{distanceInfo.distance}</span>
            </div>
            <div className="w-full md:w-1/2 flex items-center mt-2 md:mt-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Estimated travel time: </span>
              <span className="ml-1">{distanceInfo.duration}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface GoogleMapLocationProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

const GoogleMapLocation = GoogleApiWrapper({
  apiKey: apiKey || "",
})(MapContainer);

export default GoogleMapLocation as React.ComponentType<GoogleMapLocationProps>;
