// src/utils/olaService.ts
import { OlaMaps } from "olamaps-web-sdk";

export type PickedLocation = {
  lat: number;
  lng: number;
  formatted_address?: string;
};

const STYLE_URL =
  "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json";

/**
 * Initialize Ola Map inside a container
 */
export const initializeMap = (
  container: HTMLElement,
  apiKey: string,
  center: [number, number], // [lng, lat]
  zoom = 15
) => {
  const olaMaps = new OlaMaps({ apiKey });
  const map = olaMaps.init({
    style: `${STYLE_URL}?api_key=${apiKey}`,
    container,
    center,
    zoom,
  });
  return { map, olaMaps };
};

/**
 * Add a draggable marker to the map
 */
export const addDraggableMarker = (
  olaMaps: any,
  map: any,
  lng: number,
  lat: number,
  onDragEnd?: (loc: PickedLocation) => void
) => {
  const marker = olaMaps
    .addMarker({
      color: "#FF0000",
      draggable: true,
    })
    .setLngLat([lng, lat])
    .addTo(map);

  marker.on("dragend", async () => {
    const pos = marker.getLngLat();
    if (pos && onDragEnd) {
      const formatted_address = await reverseGeocode(pos.lat, pos.lng, olaMaps.apiKey);
      onDragEnd({ lat: pos.lat, lng: pos.lng, formatted_address });
    }
  });

  return marker;
};

/**
 * Reverse Geocoding via Ola Maps Places API
 */
export const reverseGeocode = async (
  lat: number,
  lng: number,
  apiKey: string
): Promise<string> => {
  try {
    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.results?.[0]?.formatted_address || "";
  } catch (err) {
    console.error("Reverse geocode failed", err);
    return "";
  }
};
