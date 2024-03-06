import React from "react";
import L from "leaflet";

import { Marker, Tooltip, useMapEvents } from "react-leaflet";

const LocationPickerMarker = ({ markerPosition, setMarkerPosition, view }) => {
  const icon = L.icon({
    iconUrl: "/icons/LocationPin.png",
    iconSize: [80, 80],
    iconAnchor: [40, 50],
  });

  const map =
    !view &&
    useMapEvents({
      click: (e) => {
        setMarkerPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
  return markerPosition === null ? null : (
    <Marker position={markerPosition} icon={icon} autoPan={false}></Marker>
  );
};

export default LocationPickerMarker;
