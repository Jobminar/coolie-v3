import React, { createContext, useState, useEffect } from "react";
import { useLocationPrice } from "../context/LocationPriceContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { customPriceData, districtPriceData } = useLocationPrice();

  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState([]); // Initialize as an empty array
  const [locationCat, setLocationCat] = useState([]);
  const [locationSubCat, setLocationSubCat] = useState([]);
  const [locationServices, setLocationServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for better UX

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        const result = await response.json();
        console.log("Categories API Response:", result);

        if (Array.isArray(result) && result.length > 0) {
          setCategoryData(result);
          setSelectedCategoryId(result[0]._id); // Default to the first category
        } else {
          setError("No categories available.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`,
          );
          const result = await response.json();
          console.log("Subcategories API Response:", result);

          if (Array.isArray(result)) {
            setSubCategoryData(result);
          } else {
            setSubCategoryData([]);
            setError("No subcategories available for this category.");
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setError("Failed to load subcategories.");
        } finally {
          setLoading(false);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // Fetch services based on selected category and subcategory
  useEffect(() => {
    if (selectedCategoryId && selectedSubCategoryId) {
      const fetchServices = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`,
          );
          const data = await response.json();
          console.log("Services API Response:", data);
        } catch (error) {
          console.error("Error fetching services:", error);
          setError("Failed to load services.");
          setServicesData([]); // Fallback to empty array on error
        } finally {
          setLoading(false);
        }
      };

      fetchServices();
    }
  }, [selectedCategoryId, selectedSubCategoryId]);

  // Match categories with pricing data
  useEffect(() => {
    if (categoryData.length && (districtPriceData || customPriceData)) {
      const matched = categoryData.filter(
        (cat) =>
          districtPriceData?.some((record) => record.category === cat.name) ||
          customPriceData?.some((record) => record.category === cat.name),
      );
      console.log("Matched Categories:", matched);
      setLocationCat(matched);
    }
  }, [categoryData, districtPriceData, customPriceData]);

  // Match subcategories with pricing data
  useEffect(() => {
    if (subCategoryData.length && (districtPriceData || customPriceData)) {
      const matched = subCategoryData.filter(
        (subCat) =>
          districtPriceData?.some(
            (record) => record.subcategory === subCat.name,
          ) ||
          customPriceData?.some((record) => record.subcategory === subCat.name),
      );
      console.log("Matched Subcategories:", matched);
      setLocationSubCat(matched);
    }
  }, [subCategoryData, districtPriceData, customPriceData]);

  // Match services with pricing data
  useEffect(() => {
    if (servicesData.length && (districtPriceData || customPriceData)) {
      const pricingData = [
        ...(districtPriceData || []),
        ...(customPriceData || []),
      ];

      const matched = servicesData.filter((service) =>
        pricingData.some(
          (record) =>
            record.servicename === service.name &&
            record.subcategory === service.subCategoryId.name,
        ),
      );
      console.log("Matched Services:", matched);
      setLocationServices(matched);
    }
  }, [servicesData, districtPriceData, customPriceData]);

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
        loading, // Pass loading state to handle loading indicators
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
