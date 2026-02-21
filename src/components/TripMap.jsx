import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 15.2993, // Example location (Karnataka)
  lng: 74.1240,
};

function TripMap() {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setCenter(defaultCenter),
        { timeout: 10000 }
      );
    } else {
      setCenter(defaultCenter);
    }
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  if (!center) {
    return <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default TripMap;
