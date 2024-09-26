import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ServiceSearchComponent.css";

const ServiceSearchComponent = ({ searchQuery, onSelect }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch services data from the API
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://api-tasktigers.azurewebsites.net/v1.0/core/services/",
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on the search query
    if (searchQuery.length > 2) {
      const filtered = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredServices(filtered);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [searchQuery, services]);

  // Handle clicking outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleServiceSelect = (serviceName) => {
    onSelect(serviceName); // Update the parent with the selected service
    setIsDropdownVisible(false);
    navigate("/services"); // Navigate directly to "/services"
  };

  return (
    <div className="service-search-container" ref={containerRef}>
      {isDropdownVisible && (
        <div className="search-results">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service._id}
                className="search-result-item"
                onClick={() => handleServiceSelect(service.name)}
              >
                {service.name}
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceSearchComponent;
