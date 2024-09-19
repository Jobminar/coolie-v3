import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import LZString from "lz-string"; // Importing LZString for compression
import { toast } from "react-hot-toast";

// Create the context for Location and Price
const LocationPriceContext = createContext();

// Custom hook to use the LocationPriceContext
export const useLocationPrice = () => useContext(LocationPriceContext);

// The provider component that wraps your app and provides context values
export const LocationPriceProvider = ({ children }) => {
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

  // Function to compress and store data in session storage
  const compressAndStore = (key, data) => {
    const compressedData = LZString.compress(JSON.stringify(data));
    sessionStorage.setItem(key, compressedData);
  };

  // Function to retrieve and decompress data from session storage
  const retrieveFromStorage = (key) => {
    const compressedData = sessionStorage.getItem(key);
    if (compressedData) {
      return JSON.parse(LZString.decompress(compressedData));
    }
    return null;
  };

  // Function to compress and store pincode in localStorage
  const storePincode = (pincode) => {
    const compressedPincode = LZString.compress(pincode);
    localStorage.setItem("userPincode", compressedPincode);
  };

  // Function to retrieve pincode from localStorage
  const getStoredPincode = () => {
    const compressedPincode = localStorage.getItem("userPincode");
    if (compressedPincode) {
      return LZString.decompress(compressedPincode);
    }
    return null;
  };

  // Automatically store pincode in localStorage when geocode data is fetched
  useEffect(() => {
    if (locationRef.current.postalCode) {
      storePincode(locationRef.current.postalCode);
    }
  }, [locationRef.current.postalCode]);

  // Function to clear stored data when new geocode is fetched
  const clearStoredData = () => {
    sessionStorage.removeItem("customPriceData");
    sessionStorage.removeItem("districtPriceData");
    customPriceDataRef.current = null;
    districtPriceDataRef.current = null;
  };

  // Function to fetch geocode data based on latitude and longitude

  const fetchGeocodeData = async (lat, lng) => {
    // Clear old data before starting a new fetch
    clearStoredData();

    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}?latlng=${lat},${lng}&key=${apiKey}`,
      );
      // console.log("Geocode data fetched:", response.data);

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error("No results found for the given coordinates.");
      }

      const addressComponents = response.data.results[0].address_components;
// console.log('')
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

      // console.log("Updated location data:", locationRef.current);

      // Store the pincode in localStorage after fetching geocode data
      if (locationRef.current.postalCode) {
        storePincode(locationRef.current.postalCode); // Store pincode in localStorage
        console.log(`Stored pincode: ${locationRef.current.postalCode}`);
        toast.success(`Pincode updated to: ${locationRef.current.postalCode}`);
      } else {
        toast.error("Failed to retrieve postal code from the geocode data.");
      }

      // Persist latitude and longitude in session storage

      // sessionStorage.setItem("latitude", lat);
      // sessionStorage.setItem("longitude", lng);

      // Now fetch new pricing data after clearing the old one
      await fetchPriceData(
        extractedPostalCode,
        extractedAdminLevel3,
        extractedAdminLevel2,
        extractedAdminLevel1,
        extractedLocality,
      );

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch geocode data.");
      setLoading(false);
      console.error("Error fetching geocode data:", err);
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
    let customPriceFetched = false;
    let districtPriceFetched = false;

    try {
      setLoading(true);

      // Check if data is available in session storage
      const storedCustomPricing = retrieveFromStorage("customPriceData");
      const storedDistrictPricing = retrieveFromStorage("districtPriceData");

      if (storedCustomPricing) {
        customPriceDataRef.current = storedCustomPricing;
        customPriceFetched = true;
        // console.log(
        //   "Loaded custom pricing from session storage:",
        //   storedCustomPricing,
        // );
      }

      if (storedDistrictPricing) {
        districtPriceDataRef.current = storedDistrictPricing;
        districtPriceFetched = true;
        // console.log(
        //   "Loaded district pricing from session storage:",
        //   storedDistrictPricing,
        // );
      }

      // If no custom pricing is stored, fetch it
      if (!customPriceFetched && postalCode) {
        try {
          const priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/custom/${postalCode}`,
          );
          if (priceResponse.data && priceResponse.data.length > 0) {
            customPriceDataRef.current = priceResponse.data;
            customPriceFetched = true;
            // console.log("Custom price data found:", customPriceDataRef.current);
            compressAndStore("customPriceData", priceResponse.data);
          }
        } catch (err) {
          handlePricingError(err, postalCode, "custom");
        }
      }

      // If no district pricing is stored, fetch it
      if (!districtPriceFetched) {
        await fetchDistrictPricing(
          adminLevel3,
          adminLevel2,
          adminLevel1,
          locality,
        );
      }

      if (!customPriceFetched && !districtPriceFetched) {
        setError("No pricing data available for this location.");
        console.error("We are not serving at this location.");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch price data.");
      setLoading(false);
      console.error("Error fetching price data:", err);
    }
  };

  // Function to fetch district-level pricing data
  const fetchDistrictPricing = async (
    adminLevel3,
    adminLevel2,
    adminLevel1,
    locality,
  ) => {
    let districtPriceFetched = false;

    // Fetch district-level pricing data using adminLevel3
    if (adminLevel3 && !districtPriceFetched) {
      try {
        const priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel3}`,
        );
        if (priceResponse.data && priceResponse.data.length > 0) {
          districtPriceDataRef.current = priceResponse.data;
          districtPriceFetched = true;
          compressAndStore("districtPriceData", priceResponse.data);
          // console.log("District pricing found for Admin Level 3.");
        }
      } catch (err) {
        handlePricingError(err, adminLevel3, "district");
      }
    }

    // Fetch district-level pricing data using adminLevel2
    if (adminLevel2 && !districtPriceFetched) {
      try {
        const priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel2}`,
        );
        if (priceResponse.data && priceResponse.data.length > 0) {
          districtPriceDataRef.current = priceResponse.data;
          districtPriceFetched = true;
          compressAndStore("districtPriceData", priceResponse.data);
          // console.log("District pricing found for Admin Level 2.");
        }
      } catch (err) {
        handlePricingError(err, adminLevel2, "district");
      }
    }

    // Fetch district-level pricing data using adminLevel1
    if (adminLevel1 && !districtPriceFetched) {
      try {
        const priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel1}`,
        );
        if (priceResponse.data && priceResponse.data.length > 0) {
          districtPriceDataRef.current = priceResponse.data;
          districtPriceFetched = true;
          compressAndStore("districtPriceData", priceResponse.data);
          // console.log("District pricing found for Admin Level 1.");
        }
      } catch (err) {
        handlePricingError(err, adminLevel1, "district");
      }
    }

    // Fetch district-level pricing data using locality
    if (locality && !districtPriceFetched) {
      try {
        const priceResponse = await axios.get(
          `https://api.coolieno1.in/v1.0/core/locations/district/${locality}`,
        );
        if (priceResponse.data && priceResponse.data.length > 0) {
          districtPriceDataRef.current = priceResponse.data;
          districtPriceFetched = true;
          compressAndStore("districtPriceData", priceResponse.data);
          // console.log("District pricing found for locality.");
        }
      } catch (err) {
        handlePricingError(err, locality, "locality");
      }
    }

    // Show toast if district pricing is found
    if (districtPriceFetched) {
      toast.success("District pricing found.");
    } else {
      console.error("No district pricing found at any level.");
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

  // Automatically fetch user's geolocation when the app loads, only if location isn't already stored
  useEffect(() => {
    const storedLatitude = sessionStorage.getItem("latitude");
    const storedLongitude = sessionStorage.getItem("longitude");

    if (!storedLatitude || !storedLongitude) {
      const fetchUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchGeocodeData(latitude, longitude);
            },
            (error) => {
              console.error("Error getting location:", error);
              setError("Failed to retrieve location");
            },
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          setError("Geolocation is not supported");
        }
      };

      fetchUserLocation();
    } else {
      // Fetch pricing if location is already in sessionStorage
      fetchGeocodeData(storedLatitude, storedLongitude);
    }
  }, []);

  return (
    <LocationPriceContext.Provider
      value={{
        location: locationRef.current,
        customPriceData: customPriceDataRef.current,
        districtPriceData: districtPriceDataRef.current,
        getStoredPincode,
        loading,
        error,
        fetchGeocodeData,
      }}
    >
      {children}
    </LocationPriceContext.Provider>
  );
};
