import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [district, setDistrict] = useState('Secunderabad');

  // States for location-specific data
  const [locationCat, setLocationCat] = useState([]);
  const [locationSubCat, setLocationSubCat] = useState([]);
  const [locationServices, setLocationServices] = useState([]);

  const [fetchedData, setFetchedData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api.coolieno1.in/v1.0/core/categories");
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);


// fetch subbcategories data


  useEffect(() => { 
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(`https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`);
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
      const fetchService = async () => {
        try {
          const response = await fetch(`https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`);
          const data = await response.json();
          setServicesData(data);  
        } catch (err) {
          setError(err.message);
        }
      };

      fetchService();
    }
  }, [selectedCategoryId, selectedSubCategoryId]);



  // Fetch location data
  useEffect(() => {
    const fetchLocationApi = async () => {
      try {
        const response = await fetch(`https://api.coolieno1.in/v1.0/core/locations/district/${district}`);
        const data = await response.json();
        setFetchedData(data); // Store the fetched data in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLocationApi();
  }, [district]);

  

  
  // Compare categoryData and fetchedData and store the matched categoryData in locationCat
  useEffect(() => {
    if (Array.isArray(categoryData) && fetchedData.length > 0) {
      const matchedCategories = categoryData.filter(cat =>
        fetchedData.some(fetchedRecord => fetchedRecord.category === cat.name)
      );
      setLocationCat(matchedCategories);
    }
  }, [categoryData, fetchedData]);

  // Compare subCategoryData and fetchedData and store the matched subCategoryData in locationSubCat
  useEffect(() => {
    if (Array.isArray(subCategoryData) && fetchedData.length > 0) {
      // Match subcategories
      const matchedSubCategories = subCategoryData.filter(subCat =>
        fetchedData.some(fetchedRecord => fetchedRecord.subcategory === subCat.name)
      );
      setLocationSubCat(matchedSubCategories);
    }
  
  }, [subCategoryData, fetchedData]);
  

  // Compare servicesData and fetchedData and store the matched servicesData in locationServices
  useEffect(() => {
    if (Array.isArray(servicesData) && Array.isArray(fetchedData) && fetchedData.length > 0) {
      const matchedServices = servicesData.filter(service =>
        fetchedData.some(fetchedRecord => {
          // Compare both servicename and subcategory for a more specific match
          return (
            fetchedRecord.servicename === service.name &&
            fetchedRecord.subcategory === service.subCategoryId.name
          );
        })
      );
  
      // Store matched services in locationServices
      setLocationServices(matchedServices);
    }
  }, [servicesData, fetchedData]);
  

  // Logging the matched data
  useEffect(() => {
    console.log(locationCat, 'location wise category data');
  }, [locationCat]);

  useEffect(() => {
    console.log(locationSubCat, 'location wise sub category data');
  }, [locationSubCat]);

  useEffect(() => {
    console.log(locationServices, 'location wise services data');
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
        fetchedData,
        locationServices,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
