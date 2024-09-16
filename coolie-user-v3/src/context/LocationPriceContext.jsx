import React, { createContext, useContext, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext"; // Importing the global toast context

// Create the context for Location and Price
const LocationPriceContext = createContext();

// Custom hook to use the LocationPriceContext
export const useLocationPrice = () => useContext(LocationPriceContext);

// The provider component that wraps your app and provides context values
export const LocationPriceProvider = ({ children }) => {
  const { addToast } = useToast(); // Access the global addToast function

  // Use refs to store data persistently across renders
  const locationRef = useRef({
    adminLevel3: "",
    adminLevel2: "",
    adminLevel1: "",
    locality: "",
    postalCode: "",
  });

  const customPriceDataRef = useRef(null);
  const districtPriceDataRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch geocode data based on latitude and longitude
  const fetchGeocodeData = async (lat, lng) => {
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    console.log("fetchGeocodeData called with coordinates:", { lat, lng });

    try {
      setLoading(true);

      const response = await axios.get(
        `${apiUrl}?latlng=${lat},${lng}&key=${apiKey}`,
      );
      if (!response.data.results || response.data.results.length === 0) {
        throw new Error("No results found for the given coordinates.");
      }

      const addressComponents = response.data.results[0].address_components;

      let extractedAdminLevel3 = "";
      let extractedAdminLevel2 = "";
      let extractedAdminLevel1 = "";
      let extractedLocality = "";
      let extractedPostalCode = "";

      // Extract postal code and administrative levels from address components
      addressComponents.forEach((component) => {
        if (component.types.includes("postal_code")) {
          extractedPostalCode = component.long_name;
        }
        if (component.types.includes("administrative_area_level_3")) {
          extractedAdminLevel3 = component.long_name;
        }
        if (component.types.includes("administrative_area_level_2")) {
          extractedAdminLevel2 = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          extractedAdminLevel1 = component.long_name;
        }
        if (component.types.includes("locality")) {
          extractedLocality = component.long_name;
        }
      });

      // Update locationRef with the extracted data
      locationRef.current = {
        adminLevel3: extractedAdminLevel3 || "Not found",
        adminLevel2: extractedAdminLevel2 || "Not found",
        adminLevel1: extractedAdminLevel1 || "Not found",
        locality: extractedLocality || "Not found",
        postalCode: extractedPostalCode || "Not found",
      };

      console.log("Location updated:", locationRef.current);

      // Fetch price data based on the extracted postal code and administrative levels
      await fetchPriceData(
        extractedPostalCode,
        extractedAdminLevel3,
        extractedAdminLevel2,
        extractedAdminLevel1,
        extractedLocality,
      );

      setLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to fetch address data.");
      setLoading(false);
      console.error("Error fetching geocode data:", err);
      addToast("Failed to fetch location data. Please try again.", "error"); // Use the addToast function
    }
  };

  // Function to fetch price data based on postal code, administrative areas, and locality
  const fetchPriceData = async (
    postalCode,
    adminLevel3,
    adminLevel2,
    adminLevel1,
    locality,
  ) => {
    try {
      let priceResponse;
      setLoading(true);
      let foundPricing = false;

      // Fetch custom pricing data using the postal code
      if (postalCode) {
        try {
          console.log(`Fetching custom pricing for postal code: ${postalCode}`);
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/custom/${postalCode}`,
          );

          if (priceResponse.data && priceResponse.data.length > 0) {
            customPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "Custom price data found using postal code:",
              customPriceDataRef.current,
            );
            addToast("Custom pricing found for this location", "success"); // Trigger success toast
          } else {
            console.log(
              `No custom pricing found for postal code: ${postalCode}`,
            );
          }
        } catch (err) {
          handlePricingError(err, postalCode, "custom");
        }
      }

      // Fetch district-level pricing data using adminLevel3
      if (!foundPricing && adminLevel3) {
        try {
          console.log(
            `Fetching district pricing for Admin Level 3: ${adminLevel3}`,
          );
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel3}`,
          );

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "District price data found using Admin Level 3:",
              districtPriceDataRef.current,
            );
            addToast(
              "We are currently serving here based on district pricing",
              "success",
            );
          } else {
            console.log(
              `No district pricing found for Admin Level 3: ${adminLevel3}`,
            );
          }
        } catch (err) {
          handlePricingError(err, adminLevel3, "district");
        }
      }

      // Fallback to locality if no pricing is found using adminLevel3
      if (!foundPricing && locality) {
        try {
          console.log(`Fetching district pricing for locality: ${locality}`);
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${locality}`,
          );

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "District price data found using locality:",
              districtPriceDataRef.current,
            );
            addToast(
              "We are currently serving here based on locality pricing",
              "success",
            );
          } else {
            console.log(`No locality pricing found for: ${locality}`);
          }
        } catch (err) {
          handlePricingError(err, locality, "locality");
        }
      }

      // Fallback to adminLevel2 (state level) if necessary
      if (!foundPricing && adminLevel2) {
        try {
          console.log(
            `Fetching state pricing for Admin Level 2: ${adminLevel2}`,
          );
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel2}`,
          );

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "State price data found using Admin Level 2:",
              districtPriceDataRef.current,
            );
            addToast(
              "We are currently serving here based on state pricing",
              "success",
            );
          } else {
            console.log(
              `No state pricing found for Admin Level 2: ${adminLevel2}`,
            );
          }
        } catch (err) {
          handlePricingError(err, adminLevel2, "state");
        }
      }

      // Fallback to adminLevel1 (country level) if necessary
      if (!foundPricing && adminLevel1) {
        try {
          console.log(
            `Fetching country pricing for Admin Level 1: ${adminLevel1}`,
          );
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel1}`,
          );

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "Country price data found using Admin Level 1:",
              districtPriceDataRef.current,
            );
            addToast(
              "We are currently serving here based on country pricing",
              "success",
            );
          } else {
            console.log(
              `No country-level pricing data found for Admin Level 1: ${adminLevel1}`,
            );
          }
        } catch (err) {
          handlePricingError(err, adminLevel1, "country");
        }
      }

      // If no pricing is found at all, show a fallback message
      if (!foundPricing) {
        customPriceDataRef.current = null;
        districtPriceDataRef.current = null;
        setError("No pricing data available for this location.");
        addToast("We are not serving at this location", "error");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch price data.");
      setLoading(false);
      console.error("Error fetching price data:", err);
      addToast("Failed to fetch pricing data.", "error");
    }
  };

  // Error handling function for pricing data fetching
  const handlePricingError = (err, location, type) => {
    if (err.response && err.response.status === 404) {
      console.log(`No ${type} pricing found for: ${location}`);
    } else {
      console.error(`Error fetching ${type} pricing for: ${location}`, err);
    }
  };

  // Provide both custom and district price data to any children components
  return (
    <LocationPriceContext.Provider
      value={{
        location: locationRef.current,
        customPriceData: customPriceDataRef.current,
        districtPriceData: districtPriceDataRef.current,
        loading,
        error,
        fetchGeocodeData,
      }}
    >
      {children}
    </LocationPriceContext.Provider>
  );
};
