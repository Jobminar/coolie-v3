import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import manOnScooter from "../../assets/images/manonscooter.png"; // Ensure you have this image in the assets folder

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const ProviderTracking = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [providerLocation, setProviderLocation] = useState([
    78.5263941, 17.3694196,
  ]);
  const userLocation = [78.5263941, 17.3694196]; // Example user coordinates

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [78.5263941, 17.3694196],
        zoom: 14,
      });

      // Add user marker
      new mapboxgl.Marker({ color: "red" }).setLngLat(userLocation).addTo(map);

      // Add provider marker with custom icon
      const providerMarker = new mapboxgl.Marker({
        element: document.createElement("img"),
        anchor: "bottom",
      })
        .setLngLat(providerLocation)
        .addTo(map);

      providerMarker.getElement().src = manOnScooter;
      providerMarker.getElement().style.width = "30px";

      setMap(map);

      // Update route when provider moves
      const updateProviderLocation = () => {
        const newLocation = [
          providerLocation[0] + 0.001,
          providerLocation[1] + 0.001,
        ];
        setProviderLocation(newLocation);
        providerMarker.setLngLat(newLocation);
        map.flyTo({ center: newLocation });
      };

      const intervalId = setInterval(updateProviderLocation, 5000);

      return () => clearInterval(intervalId);
    };

    if (!map) initializeMap({ setMap, mapContainerRef });
  }, [map, providerLocation]);

  return (
    <div
      className="maps-container"
      ref={mapContainerRef}
      style={{ width: "100%", height: "400px" }}
    />
  );
};

export default ProviderTracking;
