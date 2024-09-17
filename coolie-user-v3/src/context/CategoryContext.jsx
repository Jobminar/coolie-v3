import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocationPrice } from "../context/LocationPriceContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { customPriceData, districtPriceData } = useLocationPrice();


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



  // comparisions of data
  // Compare categoryData with districtPriceData
  useEffect(() => {
    if (categoryData && districtPriceData) {
      const matched = categoryData.filter((cat) =>
        districtPriceData.some((record) => record.category === cat.name)
      );
      setLocationCat(matched); 
    }
  }, [categoryData, districtPriceData]);



  // Compare subCategoryData with customPriceData and districtPriceData
  useEffect(() => {
    if (subCategoryData && districtPriceData) {
      const matched = subCategoryData.filter((subCat) =>
        districtPriceData.some((record) => record.subcategory === subCat.name)
      );

      setLocationSubCat(matched); // Store matched subcategories
    }
  }, [subCategoryData, districtPriceData]);



  useEffect(() => {
    if (servicesData && districtPriceData) {
      // Filter servicesData based on matching servicename and subcategory in districtPriceData
      const matched = servicesData.filter((service) =>
        districtPriceData.some(
          (record) =>
            record.servicename === service?.name && 
            record.subcategory === service?.subCategoryId?.name
        )
      );
  
      setLocationServices(matched); // Store only the matched services data
    }
  }, [servicesData, districtPriceData]);
  


  

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
