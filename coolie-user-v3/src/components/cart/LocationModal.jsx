import React, { useState, useEffect, useRef } from "react";
import "./LocationModal.css";
import { useAuth } from "../../context/AuthContext";
import markerImage from "../../assets/images/user-marker.gif";
import { FaRegCheckCircle, FaCrosshairs } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

// Google Maps API key
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationModal = ({ onLocationSelect, onClose }) => {
  const { userLocation } = useAuth(); // Use userLocation from AuthContext
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    latitude:
      parseFloat(sessionStorage.getItem("markedLat")) ||
      userLocation?.latitude ||
      0,
    longitude:
      parseFloat(sessionStorage.getItem("markedLng")) ||
      userLocation?.longitude ||
      0,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
    script.async = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script.");
    };
    document.head.appendChild(script);
  }, []);

  const initializeMap = () => {
    const initialLocation = {
      lat: tempLocation.latitude || userLocation?.latitude || 0,
      lng: tempLocation.longitude || userLocation?.longitude || 0,
    };

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: initialLocation,
      zoom: 12,
      streetViewControl: false, // Disable Street View control
    });

    mapInstanceRef.current = map;

    const newMarker = new window.google.maps.Marker({
      position: initialLocation,
      map: map,
      draggable: true,
      icon: {
        url: markerImage,
        scaledSize: new window.google.maps.Size(65, 65), // Marker size
      },
    });

    setMarker(newMarker);

    fetchAddress(initialLocation.lat, initialLocation.lng).then(
      (fetchedAddress) => {
        setAddress(fetchedAddress);
      },
    );

    // Add listener for dragging the marker
    newMarker.addListener("dragend", async () => {
      const position = newMarker.getPosition();
      const lat = position.lat();
      const lng = position.lng();
      setTempLocation({ latitude: lat, longitude: lng });
      const fetchedAddress = await fetchAddress(lat, lng);
      setAddress(fetchedAddress);
    });

    // Listener for map clicks to move marker
    map.addListener("click", async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      newMarker.setPosition(e.latLng);
      setTempLocation({ latitude: lat, longitude: lng });
      const fetchedAddress = await fetchAddress(lat, lng);
      setAddress(fetchedAddress);
    });

    const input = document.getElementById("location-search-input");
    const searchBox = new window.google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      newMarker.setPosition(place.geometry.location);
      map.setCenter(place.geometry.location);
      setTempLocation({ latitude, longitude });

      fetchAddress(latitude, longitude).then((fetchedAddress) => {
        setAddress(fetchedAddress);
      });
    });

    // Add control to recenter map and marker to current location
    const recenterControlDiv = document.createElement("div");
    recenterControlDiv.classList.add("recenter-control");
    recenterControlDiv.innerHTML = `<div class="recenter-icon"><i class="fa fa-crosshairs"></i></div>`; // Crosshairs icon

    // Recenter control functionality
    recenterControlDiv.addEventListener("click", () => {
      if (userLocation) {
        const { latitude, longitude } = userLocation;
        map.setCenter({ lat: latitude, lng: longitude });
        newMarker.setPosition({ lat: latitude, lng: longitude });
        setTempLocation({ latitude, longitude });

        fetchAddress(latitude, longitude).then((fetchedAddress) => {
          setAddress(fetchedAddress);
        });
      }
    });

    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(
      recenterControlDiv,
    );
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`,
      );
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Unknown location";
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "Error fetching address";
    }
  };

  const handleConfirmLocation = async () => {
    setLoading(true);

    let finalLat = tempLocation.latitude;
    let finalLng = tempLocation.longitude;

    // If the user hasn't moved the marker, use the current location by default
    if (finalLat === 0 && finalLng === 0 && userLocation) {
      finalLat = userLocation.latitude;
      finalLng = userLocation.longitude;
    }

    const fetchedAddress = await fetchAddress(finalLat, finalLng);
    console.log("fetchedAddress in LocationModal", fetchedAddress);
    onLocationSelect({
      address: fetchedAddress,
      latitude: finalLat,
      longitude: finalLng,
    });
    setLoading(false);
  };

  return (
    <div className="location-container">
      {loading && (
        <div className="loading-overlay">
          <TailSpin
            height="80"
            width="80"
            color="#0988cf"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible={true}
          />
        </div>
      )}
      <div className="location-info">
        <p>
          <strong>Address:</strong> {address}
        </p>
      </div>
      <div className="search-container">
        <input
          id="location-search-input"
          className="search-box"
          type="text"
          placeholder="Search for a location (e.g., address, POI, neighborhood)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div id="map" className="map-container" ref={mapContainerRef}></div>
      <button
        className="gps-button"
        onClick={() => {
          if (mapInstanceRef.current && userLocation) {
            const { latitude, longitude } = userLocation;
            mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
            if (marker) marker.setPosition({ lat: latitude, lng: longitude });
            setTempLocation({ latitude, longitude });
            fetchAddress(latitude, longitude).then(setAddress);
          }
        }}
        title="Recenter to current location"
      >
        <FaCrosshairs />
      </button>
      <div className="instructions">
        <p className="location-description">
          <strong>Welcome!</strong> You can use this map to set your location.
          Drag the marker to your desired location or click on the map to place
          the marker.
        </p>
        <div className="location-buttons">
          <button
            onClick={handleConfirmLocation}
            className="use-location-button"
            disabled={loading}
          >
            CONFIRM LOCATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
