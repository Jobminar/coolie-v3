import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroup, Spinner, Card, Button } from "react-bootstrap";
import { useLocationPrice } from "../../context/LocationPriceContext"; // Import the context to send coordinates
import "mapbox-gl/dist/mapbox-gl.css";
import "./CitySearchComponent.css";

const CitySearchComponent = ({ query, onSelect, onClose }) => {
  const { fetchGeocodeData } = useLocationPrice(); // Use the context
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Fetch cities based on user query
  useEffect(() => {
    if (query.length > 2) {
      const fetchCities = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=in&limit=10&access_token=${MAPBOX_ACCESS_TOKEN}`,
          );
          const cityData = response.data.features.map((feature) => ({
            name: feature.place_name,
            coordinates: feature.geometry.coordinates,
          }));
          setCities(cityData);
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCities();
    }
  }, [query, MAPBOX_ACCESS_TOKEN]);

  // Handle city click and pass coordinates to the context
  const handleCityClick = (city) => {
    fetchGeocodeData(city.coordinates[1], city.coordinates[0]); // Pass lat and lng to context
    onSelect(city); // Pass city data back to parent if needed
    onClose(); // Close the search component
    setCities([]); // Clear cities after selection
  };

  return (
    <Card className="city-search-card mt-2">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="header-text">Search Results</span>
        <Button variant="light" onClick={onClose} className="close-button">
          &times;
        </Button>
      </Card.Header>
      <Card.Body className="p-2 city-search-content">
        {loading && (
          <div className="d-flex justify-content-center my-2">
            <Spinner animation="border" />
          </div>
        )}
        {!loading && cities.length > 0 && (
          <ListGroup>
            {cities.map((city, index) => (
              <ListGroup.Item
                action
                key={index}
                onClick={() => handleCityClick(city)}
                className="list-group-item"
              >
                {city.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        {!loading && cities.length === 0 && query.length > 2 && (
          <div className="text-center text-muted no-results">
            No results found
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

CitySearchComponent.propTypes = {
  query: PropTypes.string.isRequired, // Search query
  onSelect: PropTypes.func.isRequired, // Function when a city is selected
  onClose: PropTypes.func.isRequired, // Function to close the search component
};

export default CitySearchComponent;
