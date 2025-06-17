import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY!;

interface LocationProps {
  address: string;
  latitude: number;
  longitude: number;
}

interface DistanceInfo {
  distance: string;
  duration: string;
  loading: boolean;
  error: string | null;
}

interface NavigationStatus {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  nextDirection: string;
}

interface MapState {
  currentPosition: { lat: number; lng: number } | null;
  distanceInfo: DistanceInfo;
  directions: google.maps.DirectionsResult | null;
  navigation: NavigationStatus;
}

interface GoogleMapLocationProps {
  location: LocationProps;
}

const containerStyle = { width: "100%", height: "300px" };

const GoogleMapLocation: React.FC<GoogleMapLocationProps> = ({ location }) => {
  const [mapState, setMapState] = useState<MapState>({
    currentPosition: null,
    distanceInfo: { distance: "", duration: "", loading: true, error: null },
    directions: null,
    navigation: { isActive: false, currentStep: 0, totalSteps: 0, nextDirection: "" },
  });

  useEffect(() => {
    // ...geolocation effect (same as before)...
  }, []);

  useEffect(() => {
    if (!mapState.currentPosition) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: mapState.currentPosition,
        destination: { lat: location.latitude, lng: location.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0].legs[0];
          setMapState(prev => ({
            ...prev,
            directions: result,
            distanceInfo: { 
              distance: leg.distance?.text ?? "N/A", 
              duration: leg.duration?.text ?? "N/A", 
              loading: false, 
              error: null 
            },
            navigation: {
              ...prev.navigation,
              totalSteps: leg.steps.length,
              nextDirection: leg.steps[0]?.instructions ?? "",
            },
          }));
        } else {
          setMapState(prev => ({
            ...prev,
            distanceInfo: { ...prev.distanceInfo, loading: false, error: "Unable to calculate route." },
          }));
        }
      }
    );
  }, [mapState.currentPosition, location]);

  // 🧭 Marker positions memoized
  const destinationMarker = useMemo(() => ({
    position: { lat: location.latitude, lng: location.longitude },
    title: "Destination",
  }), [location]);

  const currentMarker = useMemo(() => (
    mapState.currentPosition ? { position: mapState.currentPosition, title: "Your Location" } : null
  ), [mapState.currentPosition]);

  const startNavigation = () => { /*...*/ };
  const stopNavigation = () => { /*...*/ };
  const moveToNextStep = () => { /*...*/ };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <div className="shadow p-3">
        <GoogleMap mapContainerStyle={containerStyle} zoom={13} center={{ lat: location.latitude, lng: location.longitude }}>
          {destinationMarker && <Marker {...destinationMarker} />}
          {currentMarker && <Marker {...currentMarker} />}
          {mapState.directions && <DirectionsRenderer directions={mapState.directions} options={{ suppressMarkers: true }} />}
        </GoogleMap>

        <div className="mt-4 bg-gray-50 p-3 rounded">
          {mapState.distanceInfo.loading && <p>Calculating...</p>}
          {mapState.distanceInfo.error && <p className="text-red-500">{mapState.distanceInfo.error}</p>}
          {!mapState.distanceInfo.loading && !mapState.distanceInfo.error && (
            <>
              <p><strong>Distance:</strong> {mapState.distanceInfo.distance}</p>
              <p><strong>Time:</strong> {mapState.distanceInfo.duration}</p>

              {mapState.navigation.isActive ? (
                <>
                  <button onClick={stopNavigation} className="btn-red">Stop</button>
                  <p>Step {mapState.navigation.currentStep + 1} of {mapState.navigation.totalSteps}</p>
                  <div dangerouslySetInnerHTML={{ __html: mapState.navigation.nextDirection }} />
                  <button onClick={moveToNextStep} className="btn-gray">Next Step</button>
                </>
              ) : (
                <button onClick={startNavigation} className="btn-blue">Start Navigation</button>
              )}
            </>
          )}
        </div>
      </div>
    </LoadScript>
  );
};

export default React.memo(GoogleMapLocation);
