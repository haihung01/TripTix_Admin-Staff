import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./renderLocationOnMap.scss";
import L from "leaflet";

const Map = ({ position, name }) => {
  const customMarkerIcon = new L.Icon({
    iconUrl: "/locationIMG.png", // Đường dẫn đến hình ảnh icon tùy chỉnh
    iconSize: [32, 45], // Kích thước icon (width, height)
    iconAnchor: [16, 32], // Vị trí neo (anchor) của icon
    popupAnchor: [0, -32], // Vị trí neo của popup khi hiển thị
  });
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customMarkerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
};
export default Map;
