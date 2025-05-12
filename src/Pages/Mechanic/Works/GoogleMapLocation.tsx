import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Map as GoogleMap,
  GoogleApiWrapper,
  IProvidedProps,
  Marker,
  InfoWindow,
  IMarkerProps,
} from "google-maps-react"; // Added IMarkerProps import
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

interface NavigationStatus {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  nextDirection: string;
}

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { google, location } = props;
  const [mapState, setMapState] = useState({
    currentPosition: null as { lat: number; lng: number } | null,
    distanceInfo: {
      distance: "",
      duration: "",
      loading: true,
      error: null,
    } as DistanceInfo,
    directions: null as google.maps.DirectionsResult | null,
    navigation: {
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      nextDirection: "",
    } as NavigationStatus,
    showInfoWindow: false,
    activeMarker: null as google.maps.Marker | null,
    selectedPlace: null as any,
  });

  // Refs for map and directionsRenderer
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const isInitialMount = useRef(true);

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

  // Get current position - only run once on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapState((prev) => ({
            ...prev,
            currentPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Error getting current position:", error);
          setMapState((prev) => ({
            ...prev,
            distanceInfo: {
              ...prev.distanceInfo,
              loading: false,
              error:
                "Unable to get your current location. Please enable location services.",
            },
          }));
        }
      );
    } else {
      setMapState((prev) => ({
        ...prev,
        distanceInfo: {
          ...prev.distanceInfo,
          loading: false,
          error: "Geolocation is not supported by this browser.",
        },
      }));
    }
  }, []); // Empty dependency array ensures this runs only once

  // Calculate route only when currentPosition changes or when component mounts
  useEffect(() => {
    if (
      !mapState.currentPosition ||
      !google ||
      !location.latitude ||
      !location.longitude
    )
      return;

    const calculateRoute = () => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: new google.maps.LatLng(
            mapState.currentPosition?.lat ?? 0,
            mapState.currentPosition?.lng ?? 0
          ),
          destination: new google.maps.LatLng(
            location.latitude,
            location.longitude
          ),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            // Batch all state updates together
            const route = result.routes[0];
            const leg = route && route.legs.length > 0 ? route.legs[0] : null;

            setMapState((prev) => ({
              ...prev,
              directions: result,
              distanceInfo: {
                distance: leg?.distance?.text || "",
                duration: leg?.duration?.text || "",
                loading: false,
                error: null,
              },
              navigation: {
                ...prev.navigation,
                totalSteps: leg?.steps?.length || 0,
                nextDirection: leg?.steps?.[0]?.instructions || "",
              },
            }));
          } else {
            setMapState((prev) => ({
              ...prev,
              distanceInfo: {
                distance: "",
                duration: "",
                loading: false,
                error: "Unable to calculate distance and duration.",
              },
            }));
          }
        }
      );
    };

    calculateRoute();
  }, [mapState.currentPosition, google, location]);

  // Update directions renderer when directions change or map/renderer is initialized
  useEffect(() => {
    if (mapState.directions && directionsRendererRef.current) {
      directionsRendererRef.current.setDirections(mapState.directions);
    }
  }, [mapState.directions, directionsRendererRef.current]);

  // Set up directions renderer when the map is loaded - memoize to prevent unnecessary re-creation

  interface IMapProps {
    google: typeof google;
    map: google.maps.Map;
  }

  const onMapLoaded = useCallback(
    (mapProps: IMapProps, map: google.maps.Map) => {
      mapRef.current = map;

      if (google && map) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true, // We'll handle markers ourselves
        });
      }

      // Apply directions if they already exist
      if (mapState.directions && directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(mapState.directions);
      }
    },
    [google, mapState.directions]
  );

  // Memoize handlers to prevent unnecessary re-creation
  // Fix: Updated the handleMarkerClick function to match the expected types
  const handleMarkerClick = useCallback((props: any, marker: any, e: any) => {
    setMapState((prev) => ({
      ...prev,
      activeMarker: marker,
      showInfoWindow: true,
      selectedPlace: props,
    }));
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setMapState((prev) => ({
      ...prev,
      showInfoWindow: false,
      activeMarker: null,
    }));
  }, []);

  // Navigation functions - memoized to prevent recreation on every render
  const startNavigation = useCallback(() => {
    if (!mapState.directions) return;

    setMapState((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        isActive: true,
        currentStep: 0,
      },
    }));
  }, [mapState.directions]);

  const stopNavigation = useCallback(() => {
    setMapState((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        isActive: false,
      },
    }));
  }, []);

  const moveToNextStep = useCallback(() => {
    setMapState((prev) => {
      if (prev.navigation.currentStep < prev.navigation.totalSteps - 1) {
        const nextStep = prev.navigation.currentStep + 1;
        const nextDirection =
          prev.directions?.routes[0]?.legs[0]?.steps[nextStep]?.instructions ||
          "";

        return {
          ...prev,
          navigation: {
            ...prev.navigation,
            currentStep: nextStep,
            nextDirection,
          },
        };
      } else {
        return {
          ...prev,
          navigation: {
            ...prev.navigation,
            isActive: false,
          },
        };
      }
    });
  }, []);

  // Memoize destination marker props to prevent re-renders
  const destinationMarkerProps = useMemo(
    () => ({
      position: {
        lat: location.latitude,
        lng: location.longitude,
      },
      title: "Destination",
      name: location.address,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    }),
    [location]
  );

  // Memoize current position marker props to prevent re-renders
  const currentPositionMarkerProps = useMemo(
    () =>
      mapState.currentPosition
        ? {
            position: mapState.currentPosition,
            title: "Your Location",
            name: "Your Current Location",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            },
          }
        : null,
    [mapState.currentPosition]
  );

  return (
    <div className="bg-gray-200 rounded-lg shadow p-3 mb-6">
      <div className="flex flex-col items-center ">
        <h3 className="text-lg font-semibold mb-3">Location</h3>
      </div>
      <div className="bg-gray-50">
        <div style={containerStyles}>
          <div style={containerStyles}>
            <GoogleMap
              google={props.google}
              style={mapStyles}
              zoom={13}
              initialCenter={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              onReady={(mapProps, map) =>
                map && onMapLoaded(mapProps as IMapProps, map)
              }
            >
              {/* Destination marker */}
              <Marker {...destinationMarkerProps} onClick={handleMarkerClick} />

              {/* Current position marker */}
              {currentPositionMarkerProps && (
                <Marker
                  {...currentPositionMarkerProps}
                  onClick={handleMarkerClick}
                />
              )}

              <InfoWindow
                marker={mapState.activeMarker}
                visible={mapState.showInfoWindow}
                onClose={handleInfoWindowClose}
              >
                <div className="p-2">
                  <h4 className="font-semibold">
                    {mapState.selectedPlace?.name || ""}
                  </h4>
                </div>
              </InfoWindow>
            </GoogleMap>
          </div>
        </div>
      </div>

      {/* Distance and duration information */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        {mapState.distanceInfo.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <span>Calculating distance and travel time...</span>
          </div>
        ) : mapState.distanceInfo.error ? (
          <div className="text-red-500">{mapState.distanceInfo.error}</div>
        ) : (
          <>
            <div className="flex flex-wrap mb-4">
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
                <span className="ml-1">{mapState.distanceInfo.distance}</span>
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
                <span className="ml-1">{mapState.distanceInfo.duration}</span>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Navigation</h4>
                <div>
                  {!mapState.navigation.isActive ? (
                    <button
                      onClick={startNavigation}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                      disabled={!mapState.directions}
                    >
                      Start Navigation
                    </button>
                  ) : (
                    <button
                      onClick={stopNavigation}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Stop Navigation
                    </button>
                  )}
                </div>
              </div>

              {mapState.navigation.isActive && (
                <>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-medium">
                      Current step: {mapState.navigation.currentStep + 1} of{" "}
                      {mapState.navigation.totalSteps}
                    </p>
                    <div
                      className="mt-1 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: mapState.navigation.nextDirection,
                      }}
                    />
                  </div>

                  {/* This button is for demo purposes - in a real app, steps would advance automatically */}
                  <button
                    onClick={moveToNextStep}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                  >
                    Simulate Next Step
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Wrap with React.memo to prevent re-renders if props haven't changed
const MemoizedMapContainer = React.memo(MapContainer);

interface GoogleMapLocationProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

const GoogleMapLocation = GoogleApiWrapper({
  apiKey: apiKey || "",
})(MemoizedMapContainer);

export default React.memo(
  GoogleMapLocation
) as React.ComponentType<GoogleMapLocationProps>;