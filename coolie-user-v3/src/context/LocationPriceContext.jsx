import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Importing toast for notifications

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

  const [matchedCategories, setMatchedCategories] = useState([]);
  const [matchedSubCategories, setMatchedSubCategories] = useState([]);
  const [matchedServices, setMatchedServices] = useState([]);

  const [categoryData, setCategoryData] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [servicesData, setServicesData] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        const data = await response.json();
        setCategoryData(data);
        console.log("Fetched categories:", data);
      } catch (error) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on categories
  useEffect(() => {
    if (categoryData) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            "https://api.coolieno1.in/v1.0/core/sub-categories",
          );
          const data = await response.json();
          setSubCategoryData(data);
          console.log("Fetched subcategories:", data);
        } catch (error) {
          setError("Failed to fetch subcategories");
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubCategories();
    }
  }, [categoryData]);

  // Fetch services based on subcategories
  useEffect(() => {
    if (subCategoryData) {
      const fetchServices = async () => {
        try {
          const response = await fetch(
            "https://api.coolieno1.in/v1.0/core/services",
          );
          const data = await response.json();
          setServicesData(data);
          console.log("Fetched services:", data);
        } catch (error) {
          setError("Failed to fetch services");
          console.error("Error fetching services:", error);
        }
      };

      fetchServices();
    }
  }, [subCategoryData]);

  // Function to fetch geocode data based on latitude and longitude
  const fetchGeocodeData = async (lat, lng) => {
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}?latlng=${lat},${lng}&key=${apiKey}`,
      );
      console.log("Geocode data fetched:", response.data);

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

      console.log("Updated location data:", locationRef.current);

      // Fetch price data based on the extracted postal code and administrative levels
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

  // Function to fetch price data
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
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/custom/${postalCode}`,
          );
          console.log("Custom pricing response:", priceResponse.data);

          if (priceResponse.data && priceResponse.data.length > 0) {
            customPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "Custom price data found using postal code:",
              customPriceDataRef.current,
            );
          }
        } catch (err) {
          handlePricingError(err, postalCode, "custom");
        }
      }

      // Fetch district-level pricing data using adminLevel3 (District-level)
      if (!foundPricing && adminLevel3) {
        try {
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${adminLevel3}`,
          );
          console.log("District pricing response:", priceResponse.data);

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "District price data found using Admin Level 3:",
              districtPriceDataRef.current,
            );
          }
        } catch (err) {
          handlePricingError(err, adminLevel3, "district");
        }
      }

      // Fallback to locality if no district-level pricing is found
      if (!foundPricing && locality) {
        try {
          priceResponse = await axios.get(
            `https://api.coolieno1.in/v1.0/core/locations/district/${locality}`,
          );
          console.log("Locality pricing response:", priceResponse.data);

          if (priceResponse.data && priceResponse.data.length > 0) {
            districtPriceDataRef.current = priceResponse.data;
            foundPricing = true;
            console.log(
              "District price data found using locality:",
              districtPriceDataRef.current,
            );
          }
        } catch (err) {
          handlePricingError(err, locality, "locality");
        }
      }

      // If no pricing is found, log the failure
      if (!foundPricing) {
        setError("No pricing data available for this location.");
        toast.error("We are not serving at this location");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch price data.");
      setLoading(false);
      console.error("Error fetching price data:", err);
      toast.error("Failed to fetch pricing data.");
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

  // Match categories, subcategories, and services based on pricing data
  useEffect(() => {
    if (
      categoryData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];
      const matchedCategories = categoryData.filter((cat) =>
        pricingData.some((record) => record.category === cat.name),
      );
      setMatchedCategories(matchedCategories);
      console.log("Matched categories:", matchedCategories);
    }
  }, [categoryData, customPriceDataRef.current, districtPriceDataRef.current]);

  useEffect(() => {
    if (
      subCategoryData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];
      const matchedSubCategories = subCategoryData.filter((subCat) =>
        pricingData.some((record) => record.subcategory === subCat.name),
      );
      setMatchedSubCategories(matchedSubCategories);
      console.log("Matched subcategories:", matchedSubCategories);
    }
  }, [
    subCategoryData,
    customPriceDataRef.current,
    districtPriceDataRef.current,
  ]);

  useEffect(() => {
    if (
      servicesData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];
      const matchedServices = servicesData.filter((service) =>
        pricingData.some(
          (record) =>
            record.servicename === service.name &&
            record.subcategory === service.subCategoryId.name,
        ),
      );
      setMatchedServices(matchedServices);
      console.log("Matched services:", matchedServices);
    }
  }, [servicesData, customPriceDataRef.current, districtPriceDataRef.current]);

  // Auto-fetch geocode data when the app loads
  useEffect(() => {
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

    // Fetch user location on app load
    fetchUserLocation();
  }, []);

  return (
    <LocationPriceContext.Provider
      value={{
        location: locationRef.current,
        customPriceData: customPriceDataRef.current,
        districtPriceData: districtPriceDataRef.current,
        matchedCategories,
        matchedSubCategories,
        matchedServices,
        loading,
        error,
        fetchGeocodeData,
      }}
    >
      {children}
    </LocationPriceContext.Provider>
  );
};
