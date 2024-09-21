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
  const [locationCustom , setLocationCustom] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for better UX


// useEffect(()=>{
//    console.log(locationCustom,'locationCustom in context')
//   },[locationCustom])


  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          setCategoryData(result);
          setSelectedCategoryId(result[0]._id); // Default to the first category
        } else {
          setError("No categories available.");
        }
      } catch (error) {
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
          if (Array.isArray(result)) {
            setSubCategoryData(result);
          } else {
            setSubCategoryData([]);
            setError("No subcategories available for this category.");
          }
        } catch (error) {
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
          setServicesData(data);
        } catch (error) {
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
      const matchedCategories = categoryData.filter(
        (cat) =>
          districtPriceData?.some((record) => record.category === cat.name) ||
          customPriceData?.some((record) => record.category === cat.name),
      );
      setLocationCat(matchedCategories);
    }
  }, [categoryData, districtPriceData, customPriceData]);

  // Match subcategories with pricing data based on selected category
  useEffect(() => {
    if (
      subCategoryData.length &&
      selectedCategoryId &&
      (districtPriceData || customPriceData)
    ) {
      const matchedSubCategories = subCategoryData.filter(
        (subCat) =>
          subCat.categoryId === selectedCategoryId && // Make sure subcategory belongs to the selected category
          (districtPriceData?.some(
            (record) => record.subcategory === subCat.name,
          ) ||
            customPriceData?.some(
              (record) => record.subcategory === subCat.name,
            )),
      );
      setLocationSubCat(matchedSubCategories);
    }
  }, [subCategoryData, districtPriceData, customPriceData]);


  // Match services with pricing data
  useEffect(() => {
    console.log(typeof(servicesData), districtPriceData, 'services and district in mat');
    if (Array.isArray(servicesData) && Array.isArray(districtPriceData)) {
      // Map over servicesData and find matching districtPriceData
      const matched = servicesData.reduce((acc, service) => {
        const matchingDistrict = districtPriceData.find(
          (record) =>
            record.servicename === service?.name &&
            record.subcategory === service?.subCategoryId?.name
        );
  
        if (matchingDistrict) {
          acc.push({
            service,            // Include matched service data
            districtPrice: matchingDistrict  // Include corresponding districtPriceData
          });
        }
        return acc;
      }, []);
      setLocationServices(matched); // Store the combined matched data
    } else {
      // Log an error or handle the case where data is not in the expected format
      console.error('Expected servicesData and districtPriceData to be arrays, but received:', {
        servicesData,
        districtPriceData
      });
    }
  }, [servicesData, districtPriceData, selectedSubCategoryId]);

  
//  match services with custom price data 
useEffect(() => {
  console.log(typeof(servicesData), customPriceData, 'service and customPrice in mat');
  
  if (Array.isArray(servicesData) && Array.isArray(customPriceData)) {
    // Map over serviceData and find matching customPriceData
    const matched = servicesData.reduce((acc, service) => {
      const matchingCustomPrice = customPriceData.find(
        (record) =>
          record.servicename === service?.name // Match servicename with service.name
      );

      if (matchingCustomPrice) {
        acc.push({
          service,            // Include matched service data
          customPrice: matchingCustomPrice  // Include corresponding customPriceData
        });
      }
      return acc;
    }, []);
    
    setLocationCustom(matched); // Store the combined matched data
  } else {
    // Log an error or handle the case where data is not in the expected format
    console.error('Expected serviceData and customPriceData to be arrays, but received:', {
      servicesData,
      customPriceData
    });
  }
}, [servicesData, customPriceData, selectedSubCategoryId]);



  

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
        locationCustom,
        error,
        loading, // Pass loading state to handle loading indicators
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
