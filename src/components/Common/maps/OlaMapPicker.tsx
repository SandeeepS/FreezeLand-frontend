
import React, { useEffect, useRef, useState } from "react";
import { OlaMaps } from 'olamaps-web-sdk'
type PickedLocation = {
  lat: number;
  lng: number;
  formattedAddress?: string;
};

interface OlaMapPickerProps {
  apiKey: string;                       // VITE_OLA_MAPS_API_KEY
  initialCenter?: [number, number];     // [lng, lat]
  onCancel: () => void;
  onConfirm: (loc: PickedLocation) => void;
}


const STYLE_URL =
  "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json";

const OlaMapPicker: React.FC<OlaMapPickerProps> = ({
  apiKey,
  initialCenter = [77.5946, 12.9716],   // Bengaluru fallback [lng, lat]
  onCancel,
  onConfirm,
}) => {

    console.log("api key in the Olamaps is ",apiKey)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loadingAddr, setLoadingAddr] = useState(false);
  const [addr, setAddr] = useState<string>("");

  // Reverse Geocode helper (use your backend proxy if you prefer hiding the key)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setLoadingAddr(true);
      const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      // The exact shape may change; pick something sensible:
      const first =
        data?.results?.[0]?.formatted_address ||
        data?.data?.[0]?.formattedAddress ||
        "";
      setAddr(first);
    } catch (e) {
      setAddr("");
      console.error(e);
    } finally {
      setLoadingAddr(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1) Create OlaMaps instance and initialize map
    const olaMaps = new (OlaMaps as any)({ apiKey });
    const m = olaMaps.init({
      style: STYLE_URL,
      container: containerRef.current,
      center: initialCenter, // [lng, lat]
      zoom: 15,
    });
    setMap(m);

    // 2) Optional: Geolocate button (puts camera on the user)
    try {
      m.addGeolocateControls({ trackUserLocation: false }); // docs: addGeolocateControls
      // When geolocation succeeds, drop or move marker
      m.on("geolocate", (evt: any) => {
        // Event payload may differ; browser Geolocation API usually has coords
        const lat = evt?.coords?.latitude ?? evt?.latitude;
        const lng = evt?.coords?.longitude ?? evt?.longitude;
        if (typeof lat === "number" && typeof lng === "number") {
          m.setCenter([lng, lat]);
          placeOrMoveMarker(lng, lat);
        }
      });
    } catch (e) {
      // Control isn’t required—safe to ignore if API differs
      console.warn("Geolocate control not available yet", e);
    }

    // 3) Clicking on the map picks a point
    try {
      m.onMapClick((e: any) => {
        const lng = e?.lngLat?.lng ?? e?.lng ?? initialCenter[0];
        const lat = e?.lngLat?.lat ?? e?.lat ?? initialCenter[1];
        placeOrMoveMarker(lng, lat);
      });
    } catch (e) {
      console.warn("onMapClick not available", e);
    }

    // Cleanup
    return () => {
      try {
        m?.remove?.();
      } catch {}
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const placeOrMoveMarker = (lng: number, lat: number) => {
    setPicked({ lat, lng });

    if (!marker) {
      // Create a draggable marker (API names may change; this follows docs concepts)
      const mk = map.addMarker({
        position: [lng, lat],
        draggable: true,
      });
      // When user stops dragging, capture new position
      try {
        mk.on("dragend", () => {
          const pos = mk.getPosition?.() || mk.position || [lng, lat];
          const newLng = Array.isArray(pos) ? pos[0] : pos?.lng ?? lng;
          const newLat = Array.isArray(pos) ? pos[1] : pos?.lat ?? lat;
          setPicked({ lat: newLat, lng: newLng });
          reverseGeocode(newLat, newLng);
        });
      } catch {}
      setMarker(mk);
    } else {
      try {
        marker.setPosition?.([lng, lat]) || (marker.position = [lng, lat]);
      } catch {
        // fallback: recreate if needed
      }
    }

    // Update address preview
    reverseGeocode(lat, lng);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Pick a location</h3>
          <button
            onClick={onCancel}
            className="rounded-xl bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="h-[420px] w-full overflow-hidden rounded-xl border" ref={containerRef} />

        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-h-[24px] text-sm text-gray-700">
            {loadingAddr
              ? "Fetching address…"
              : addr
              ? `📍 ${addr}`
              : picked
              ? `Lat: ${picked.lat.toFixed(6)}, Lng: ${picked.lng.toFixed(6)}`
              : "Click the map or use the target icon to locate yourself."}
          </div>

          <button
            disabled={!picked}
            onClick={() =>
              picked &&
              onConfirm({
                lat: picked.lat,
                lng: picked.lng,
                formattedAddress: addr || undefined,
              })
            }
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
