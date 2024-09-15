import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom"; // Ensure you import this
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from "../../assets/images/service-dropdown.svg";
import CartSummary from "../../components/cart/CartSummary";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginComponent from "../../components/LoginComponent";
import IEpopup from "./IEpopup";

const Services = () => {
  const {
    categoryData,
    selectedCategoryId,
    subCategoryData,
    locationSubCat,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    servicesData,
    error,
  } = useContext(CategoryContext);



  const { handleCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false); // State to manage login visibility
  const [variantName, setVariantName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const initialCategoryRef = useRef(null);

  useEffect(() => {
    if (categoryData?.length > 0) {
      const initialCategory = categoryData.find(
        (item) => item._id === selectedCategoryId,
      );

      initialCategoryRef.current = initialCategory;

      if (initialCategory) {
        const validVariants = initialCategory.uiVariant.filter(
          (variant) => variant.toLowerCase() !== "none",
        );

        if (validVariants.length > 0) {
          setVariantName(validVariants[0]);
        } else {
          setVariantName("");
        }
      } else {
        console.warn(`No category found with ID: ${selectedCategoryId}`);
        setVariantName("");
      }
    } else {
      console.warn("No category data available or the list is empty.");
      setVariantName("");
    }
  }, [categoryData, selectedCategoryId]);

  useEffect(()=>{
     console.log(selectedCategoryId, servicesData,'selected subcategory id')
  },[selectedSubCategoryId])

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const toggleDescription = (serviceId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  const handleAddToCart = (serviceId, categoryId, subCategoryId) => {
    if (!isAuthenticated) {
      setLoginVisible(true); // Show login modal if the user is not authenticated
      return;
    }
    handleCart(serviceId, categoryId, subCategoryId);
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  const handleVariant = (variantname) => {
    setVariantName(variantname);
  };

  const handleKnowMoreClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedServiceId(null);
  };

  const displayServices = (serviceData) => {
    if (serviceData && serviceData.length === 0) {
      return (
        <div className="sub-category-service-item">
          <div className="service-content">
            <h5>No services found .</h5>
          </div>
        </div>
      );
    } else if (serviceData) {
      console.log(serviceData,'services data in service page')
      return serviceData.map((service) => {
  
        // Check if the description should be expanded for this service
        const isExpanded = descriptionVisibility[service._id];
  
        return (
          <div key={service._id} className="sub-category-service-item">
            <div className="service-main-head">
              <div
                className={`service-icon-container ${
                  selectedSubCategoryId === service.subCategoryId._id ? "active" : ""
                }`}
              >
                <img
                  src={service.image}
                  alt={service.subCategoryId.name}
                  className="tab-image"
                />
              </div>
              <div className="service-content">
                <h5>{service.name}</h5>
                {/* {activeVariant && (
                  <div key={activeVariant._id} className="service-levels">
                    <p>
                      {activeVariant.min} to {activeVariant.max} {activeVariant.metric}
                    </p>
                    <p>
                      &#8377; {activeVariant.price.normal} | {activeVariant.serviceTime} mins
                    </p>
                  </div>
                )} */}
              </div>
              <div className="dropdown-con">
                <div
                  className="dropdown"
                  onClick={() => toggleDescription(service._id)}
                >
                  <img src={dropdown} alt="dropdown" />
                </div>
                <button
                  onClick={() =>
                    handleAddToCart(
                      service._id,
                      service.categoryId._id,
                      service.subCategoryId._id
                    )
                  }
                >
                  ADD
                </button>
              </div>
            </div>
            <div
              className="description"
              style={{
                display: isExpanded ? "block" : "none",
              }}
            >
              {service.description.length > 100
                ? service.description.slice(0, 30) + "..."
                : service.description}
              {service.description.length > 30 && (
                <button onClick={() => handleKnowMoreClick(service._id)}>
                  Know More
                </button>
              )}
            </div>
          </div>
        );
      });
    } else {
      return <div className="loading">No Services Available</div>;
    }
  };
  
  

  const filteredCategoryData = useMemo(() => {
    return categoryData
      ? categoryData.filter((item) => item._id === selectedCategoryId)
      : [];
  }, [categoryData, selectedCategoryId]);

  // const filteredServiceData = useMemo(() => {
  //   return servicesData
  //     ? servicesData.filter((service) => {
  //         if (variantName) {
  //           return (
  //             service.subCategoryId._id === selectedSubCategoryId &&
  //             service.serviceVariants.some(
  //               (variant) => variant.variantName === variantName,
  //             )
  //           );
  //         }
  //         return service.subCategoryId._id === selectedSubCategoryId;
  //       })
  //     : [];
  // }, [servicesData, selectedSubCategoryId, variantName]);

  return (
    <div className="services">
      <ScrollableTabs />
      <div>
        {filteredCategoryData.map((uiItem) => {
          const validVariants = uiItem.uiVariant.filter(
            (variant) => variant.toLowerCase() !== "none",
          );
          return (
            <div key={uiItem._id} className="variant">
              {validVariants.length > 0 &&
                validVariants.map((variant, index) => (
                  <div
                    key={index}
                    className={`ui-variant-item ${
                      variant === variantName ? "active" : ""
                    }`}
                    onClick={() => handleVariant(variant)}
                  >
                    {variant}
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      <div className="services-cart-display">
        <div className="subcat-services-dispaly">
          <div className="sub-category-display">
            {locationSubCat && locationSubCat.length > 0 ? (
              locationSubCat.map((subCat) => (
                <div
                  key={subCat._id}
                  className={`sub-category-item ${
                    selectedSubCategoryId === subCat._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSubCategoryId(subCat._id)}
                >
                  <div
                    className={`subcat-icon-container ${
                      selectedSubCategoryId === subCat._id ? "active" : ""
                    }`}
                  >
                    <img
                      src={subCat.imageKey}
                      alt={subCat.name}
                      className="tab-image"
                    />
                  </div>
                  <p
                    className={
                      selectedSubCategoryId === subCat._id ? "active" : ""
                    }
                  >
                    {subCat.name}
                  </p>
                </div>
              ))
            ) : (
              <p>No additional subcategories available.</p>
            )}
          </div>
          <div className="services-display">
            {displayServices(servicesData)}
          </div>
        </div>
        <div className="cart">
          <CartSummary />
        </div>
      </div>

      <IEpopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        serviceId={selectedServiceId} // Pass the selected serviceId to IEpopup
      />

      {isLoginVisible &&
        document.getElementById("modal-root") &&
        ReactDOM.createPortal(
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <LoginComponent onLoginSuccess={closeModal} />
            </div>
          </div>,
          document.getElementById("modal-root"),
        )}
    </div>
  );
};

export default Services;
