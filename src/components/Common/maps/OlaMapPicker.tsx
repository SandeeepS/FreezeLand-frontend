import React, { useEffect, useRef, useState } from "react";
import {
  addDraggableMarker,
  initializeMap,
  PickedLocation,
  reverseGeocode,
} from "../../../Utils/olaMapService";

interface OlaMapPickerProps {
  apiKey: string;
  initialCenter?: [number, number]; // [lng, lat]
  onCancel: () => void;
  onConfirm: (loc: PickedLocation) => void;
}

const OlaMapPicker: React.FC<OlaMapPickerProps> = ({
  apiKey,
  initialCenter = [77.5946, 12.9716],
  onCancel,
  onConfirm,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [picked, setPicked] = useState<PickedLocation | null>(null);
  const [loadingAddr, setLoadingAddr] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const { map, olaMaps } = initializeMap(
      containerRef.current,
      apiKey,
      initialCenter
    );

    const mk = addDraggableMarker(
      olaMaps,
      map,
      initialCenter[0],
      initialCenter[1],
      async (loc) => {
        setLoadingAddr(true);
        const addr = await reverseGeocode(loc.lat, loc.lng, apiKey);
        console.log("address picted is before adding Picked ",addr)
        setPicked({ ...loc, formatted_address: addr });
        setLoadingAddr(false);
      }
    );

    setMap(map);
    setMarker(mk);

    return () => map?.remove?.();
  }, [apiKey]);

  // Click on map to move marker
  useEffect(() => {
    if (!map || !marker) return;

    map.on("click", async (e: any) => {
      const lng = e?.lngLat?.lng ?? initialCenter[0];
      const lat = e?.lngLat?.lat ?? initialCenter[1];
      marker.setLngLat([lng, lat]);

      setLoadingAddr(true);
      const addr = await reverseGeocode(lat, lng, apiKey);
      setPicked({ lat, lng, formatted_address: addr });
      setLoadingAddr(false);
    });
  }, [map, marker]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Pick a location</h3>
          <button
            onClick={onCancel}
            className="rounded-xl bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        {/* Map container */}
        <div
          className="h-[420px] w-full overflow-hidden rounded-xl border"
          ref={containerRef}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-h-[24px] text-sm text-gray-700">
            {loadingAddr
              ? "Fetching address…"
              : picked?.formatted_address
              ? `📍 ${picked.formatted_address}`
              : picked
              ? `Lat: ${picked.lat.toFixed(6)}, Lng: ${picked.lng.toFixed(6)}`
              : "Click the map or drag the marker to pick a location."}
          </div>

          <button
            disabled={!picked}
            onClick={() => picked && onConfirm(picked)} // picked will always have {lat, lng, formattedAddress}
            className={`rounded-xl px-4 py-2 text-white ${
              picked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300"
            }`}
          >
            Use this location
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlaMapPicker;
