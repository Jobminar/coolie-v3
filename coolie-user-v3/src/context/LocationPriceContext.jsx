import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Importing toast for notifications

// Create the context for Location and Price
 const LocationPriceContext = createContext();

// Custom hook to use the LocationPriceContext
export const useLocationPrice = () => useContext(LocationPriceContext);

// The provider component that wraps your app and provides context values
export const LocationPriceProvider = ({ children }) => {
  // State for location information
  const [location, setLocation] = useState({
    adminLevel3: "",
    adminLevel2: "",
    adminLevel1: "",
    locality: "",
    postalCode: "",
  });

  // State for price data (custom and district)
  const [customPriceData, setCustomPriceData] = useState(null);
  const [districtPriceData, setDistrictPriceData] = useState(null);

  // State to handle loading and error conditions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(()=>{
  //   console.log(customPriceData,districtPriceData,'custom and diostrict in location context')
  // },[customPriceData,districtPriceData])

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

      // Update the location state with the extracted data
      setLocation({
        adminLevel3: extractedAdminLevel3 || "Not found",
        adminLevel2: extractedAdminLevel2 || "Not found",
        adminLevel1: extractedAdminLevel1 || "Not found",
        locality: extractedLocality || "Not found",
        postalCode: extractedPostalCode || "Not found",
      });

      console.log("Location updated:", {
        adminLevel3: extractedAdminLevel3,
        adminLevel2: extractedAdminLevel2,
        adminLevel1: extractedAdminLevel1,
        locality: extractedLocality,
        postalCode: extractedPostalCode,
      });

      // Fetch price data based on the extracted postal code and administrative levels
      await fetchPriceData(
        extractedPostalCode,
        extractedAdminLevel3,
        extractedAdminLevel2,
        extractedAdminLevel1,
      );
      setLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to fetch address data.");
      setLoading(false);
      console.error("Error fetching geocode data:", err);
    }
  };

  // Function to fetch price data based on postal code or administrative areas
  const fetchPriceData = async (
    postalCode,
    adminLevel3,
    adminLevel2,
    adminLevel1,
  ) => {
    try {
      let priceResponse;
      setLoading(true);

      // Fetching custom pricing data using the postal code
      if (postalCode) {
        priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/custom/${postalCode}`,
        );

        if (priceResponse.data && priceResponse.data.length > 0) {
          setCustomPriceData(priceResponse.data); // Store custom price data
          console.log(
            "Custom price data found using postal code:",
            priceResponse.data,
          );
          toast.success("Custom pricing found for this location");
        } else {
          toast.error("No custom pricing for this location");
          console.log("No custom pricing found for postal code:", postalCode);
        }
      }

      // Fetching district-level pricing data using adminLevel3
      if (adminLevel3) {
        priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel3}`,
        );

        if (priceResponse.data && priceResponse.data.length > 0) {
          setDistrictPriceData(priceResponse.data); // Store district price data
          console.log(
            "District price data found using Admin Level 3:",
            priceResponse.data,
          );
          toast.success("Pricing found based on district level");
        } else {
          console.log(
            "No district pricing data found for Admin Level 3:",
            adminLevel3,
          );
        }
      }

      // Fallback to adminLevel2 (state level) if necessary
      if (adminLevel2) {
        priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel2}`,
        );

        if (priceResponse.data && priceResponse.data.length > 0) {
          setDistrictPriceData(priceResponse.data);
          console.log(
            "State price data found using Admin Level 2:",
            priceResponse.data,
          );
          toast.success("Pricing found based on state level");
        } else {
          console.log(
            "No state pricing data found for Admin Level 2:",
            adminLevel2,
          );
        }
      }

      // Fallback to adminLevel1 (country level) if necessary
      if (adminLevel1) {
        priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel1}`,
        );

        if (priceResponse.data && priceResponse.data.length > 0) {
          setDistrictPriceData(priceResponse.data);
          console.log(
            "Country price data found using Admin Level 1:",
            priceResponse.data,
          );
          toast.success("Pricing found based on country level");
        } else {
          setError("No price data available for this location.");
          setCustomPriceData(null);
          setDistrictPriceData(null);
          console.error("No price data available for this location");
          toast.error("We are not serving at this location");
        }
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch price data.");
      setLoading(false);
      console.error("Error fetching price data:", err);
    }
  };

  // Provide both custom and district price data to any children components
  return (
    <LocationPriceContext.Provider
      value={{
        location,
        customPriceData,
        districtPriceData,
        loading,
        error,
        fetchGeocodeData,
      }}
    >
      {children}
    </LocationPriceContext.Provider>
  );
};
