import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocationPrice } from "../context/LocationPriceContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { customPriceData, districtPriceData } = useLocationPrice();

  // Use useRef for storing price data and persist them in localStorage
  const customPriceDataRef = useRef(
    JSON.parse(localStorage.getItem("customPriceData")) || null,
  );
  const districtPriceDataRef = useRef(
    JSON.parse(localStorage.getItem("districtPriceData")) || null,
  );

  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState(null);

  // States for location-specific data
  const [locationCat, setLocationCat] = useState([]);
  const [locationSubCat, setLocationSubCat] = useState([]);
  const [locationServices, setLocationServices] = useState([]);

  const [error, setError] = useState(null);

  // Update the custom and district pricing data refs when they change
  useEffect(() => {
    if (customPriceData) {
      customPriceDataRef.current = customPriceData;
      localStorage.setItem(
        "customPriceData",
        JSON.stringify(customPriceDataRef.current),
      );
    }

    if (districtPriceData) {
      districtPriceDataRef.current = districtPriceData;
      localStorage.setItem(
        "districtPriceData",
        JSON.stringify(districtPriceDataRef.current),
      );
    }

    console.log("Custom Pricing Data (Ref):", customPriceDataRef.current);
    console.log("District Pricing Data (Ref):", districtPriceDataRef.current);
  }, [customPriceData, districtPriceData]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`,
          );
          const result = await response.json();
          setSubCategoryData(result);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // Fetch services based on selected category and subcategory
  useEffect(() => {
    if (selectedCategoryId && selectedSubCategoryId) {
      const fetchServices = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`,
          );
          const data = await response.json();
          setServicesData(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchServices();
    }
  }, [selectedCategoryId, selectedSubCategoryId]);

  // Compare categoryData with customPriceData and districtPriceData
  useEffect(() => {
    const matchedCategories = [];
    if (
      categoryData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];

      // Match categories based on pricing data
      categoryData.forEach((cat) => {
        if (pricingData.some((record) => record.category === cat.name)) {
          matchedCategories.push(cat);
        }
      });

      setLocationCat(matchedCategories);
    }
  }, [categoryData]);

  // Compare subCategoryData with customPriceData and districtPriceData
  useEffect(() => {
    const matchedSubCategories = [];
    if (
      subCategoryData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];

      // Match subcategories based on pricing data
      subCategoryData.forEach((subCat) => {
        if (pricingData.some((record) => record.subcategory === subCat.name)) {
          matchedSubCategories.push(subCat);
        }
      });

      setLocationSubCat(matchedSubCategories);
    }
  }, [subCategoryData]);

  // Compare servicesData with customPriceData and districtPriceData
  useEffect(() => {
    const matchedServices = [];
    if (
      servicesData &&
      (customPriceDataRef.current || districtPriceDataRef.current)
    ) {
      const pricingData = [
        ...(customPriceDataRef.current || []),
        ...(districtPriceDataRef.current || []),
      ];

      // Match services based on pricing data
      servicesData.forEach((service) => {
        if (
          pricingData.some(
            (record) =>
              record.servicename === service.name &&
              record.subcategory === service.subCategoryId.name,
          )
        ) {
          matchedServices.push(service);
        }
      });

      setLocationServices(matchedServices);
    }
  }, [servicesData]);

  // Log the matched data for debugging purposes
  useEffect(() => {
    console.log("Matched Categories:", locationCat);
  }, [locationCat]);

  useEffect(() => {
    console.log("Matched SubCategories:", locationSubCat);
  }, [locationSubCat]);

  useEffect(() => {
    console.log("Matched Services:", locationServices);
  }, [locationServices]);

  return (
    <CategoryContext.Provider
      value={{
        categoryData,
        locationCat,
        selectedCategoryId,
        setSelectedCategoryId,
        subCategoryData,
        locationSubCat,
        selectedSubCategoryId,
        setSelectedSubCategoryId,
        servicesData,
        locationServices,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
