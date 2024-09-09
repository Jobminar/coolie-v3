import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  // location wise usestates

  // const [locationwiseCategory, setLocationwiseCategory] = useState("");
  // const [locationwiseSubCategory, setLocationwiseSubCategory] = useState("");
  // const [locationwiseServices, setLocationwiseServices] = useState("");
  // const [locationWiseData, setLocationWiseData] = useState(null); 
  const [error, setError] = useState(null);



  console.log(selectedCategoryId, "category id");

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        // Parse the response data and set categoryData state
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        // Handle any errors that occur during the fetch
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`,
          );
          // Parse the response data and set subCategoryData state
          const result = await response.json();
          setSubCategoryData(result);
        } catch (error) {
          // Handle any errors that occur during the fetch
          setError(error.message);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // Log the selected subcategory ID whenever it changes
  // useEffect(() => {
  //   if (selectedSubCategoryId) {
  //     console.log(selectedSubCategoryId, "selected sub category id in main");
  //   }
  // }, [selectedSubCategoryId]);

  // // Log the selected category ID whenever it changes
  // useEffect(() => {
  //   if (selectedCategoryId) {
  //     console.log(selectedCategoryId, "selected category id in main");
  //   }
  // }, [selectedCategoryId]);

  // Fetch services based on selected category and subcategory
  useEffect(() => {
    if (selectedCategoryId && selectedSubCategoryId) {
      const fetchService = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`,
          );
          // Parse the response data
          const data = await response.json();

          // Set the servicesData state with the fetched services
          setServicesData(data.data); // Assuming `data.data` contains the actual array of services

          // Log the fetched service data
          console.log(data, "service data in main context");
        } catch (err) {
          // Handle any errors that occur during the fetch
          setError(err.message);
          console.log(err);
        }
      };

      fetchService();
    }
  }, [selectedCategoryId, selectedSubCategoryId]);

  // Set the first category ID as the selectedCategoryId once categoryData is fetched
  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setSelectedCategoryId(categoryData[0]._id);
    }
  }, [categoryData]);

  // Set the first subcategory ID as the selectedSubCategoryId once subCategoryData is fetched
  useEffect(() => {
    if (subCategoryData && subCategoryData.length > 0) {
      setSelectedSubCategoryId(subCategoryData[0]._id);
    }
  }, [subCategoryData]);



  // fetch new location api details

  // useEffect(() => {
  //   const fetchLocationApi = async () => {
  //     try {
  //       // Fetching data from the API
  //       const response = await fetch('https://api.coolieno1.in/v1.0/core/locations/500001');
  //       const data = await response.json();
    
  //       console.log(data, 'locationwise data');

  //       // Destructuring the necessary fields from the data and storing them in useState
  //       const { category, subcategory, servicename } = data;
  //       console.log(category,'cat,subcat,service')
  //       // Setting the useState variables with the fetched data
  //       setLocationwiseCategory(category);
  //       setLocationwiseSubCategory(subcategory);
  //       setLocationwiseServices(servicename);
        
        
  //     } catch (err) {
  //       console.log("Error fetching data:", err);
  //     }
  //   };

  //   fetchLocationApi();
  // }, []);



  return (
    <CategoryContext.Provider
      value={{
        categoryData,
        selectedCategoryId,
        setSelectedCategoryId,
        subCategoryData,
        selectedSubCategoryId,
        setSelectedSubCategoryId,
        servicesData,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
