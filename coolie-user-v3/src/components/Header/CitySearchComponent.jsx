import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroup, Spinner, Card, Button } from "react-bootstrap";
import "mapbox-gl/dist/mapbox-gl.css"; // Importing Mapbox CSS
import "./CitySearchComponent.css"; // Importing the CSS file

const CitySearchComponent = ({ query, onSelect, onClose }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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

  const handleCityClick = (city) => {
    onSelect(city);
    onClose();
    setCities([]);
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
  query: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CitySearchComponent;
