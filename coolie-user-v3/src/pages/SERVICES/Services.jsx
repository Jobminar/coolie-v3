import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
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
    categoryData = [],
    selectedCategoryId,
    locationSubCat = [],
    locationServices = [],
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    servicesData,
    error,
  } = useContext(CategoryContext);

  const { handleCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [variantName, setVariantName] = useState(""); // Track selected variant
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const initialCategoryRef = useRef(null);

  // Handle UI variants and set the default variant
  useEffect(() => {
    if (categoryData.length > 0) {
      const initialCategory = categoryData.find(
        (item) => item._id === selectedCategoryId,
      );
      initialCategoryRef.current = initialCategory;

      if (initialCategory) {
        const validVariants = initialCategory.uiVariant?.filter(
          (variant) => variant.toLowerCase() !== "none",
        );

        if (validVariants?.length > 0) {
          setVariantName(validVariants[0]); // Set first valid variant
        } else {
          setVariantName(""); // Default to empty if no valid variants
        }
      } else {
        console.warn(`No category found with ID: ${selectedCategoryId}`);
      }
    } else {
      console.warn("No category data available or the list is empty.");
    }
  }, [categoryData, selectedCategoryId]);

  // Filter subcategories based on the selected variant
  const filteredSubCategories = useMemo(() => {
    if (!locationSubCat || variantName === "") return locationSubCat;

    return locationSubCat.filter(
      (subCat) => subCat.variantName === variantName,
    );
  }, [locationSubCat, variantName]);

  // Automatically select the first subcategory when variant changes or filteredSubCategories change
  useEffect(() => {
    if (filteredSubCategories.length > 0) {
      setSelectedSubCategoryId(filteredSubCategories[0]._id);
    }
  }, [filteredSubCategories, setSelectedSubCategoryId]);

  // Toggle description visibility for services
  const toggleDescription = (serviceId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  // Handle Add to Cart functionality with login check
  const handleAddToCart = (serviceId, categoryId, subCategoryId) => {
    if (!isAuthenticated) {
      setLoginVisible(true);
      return;
    }
    handleCart(serviceId, categoryId, subCategoryId);
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  // Handle variant selection
  const handleVariant = (variantname) => {
    setVariantName(variantname);
  };

  // Open the service detail popup
  const handleKnowMoreClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedServiceId(null);
  };

  // Display services or error message inside "services-display" div
  const displayServices = (serviceData) => {
    if (!Array.isArray(serviceData) || serviceData.length === 0) {
      return (
        <div className="services-display">
          <h5>Error: No services found for the selected subcategory.</h5>
        </div>
      );
    }

    return serviceData.map((service) => {
      const isExpanded = descriptionVisibility[service._id];

      return (
        <div key={service._id} className="sub-category-service-item">
          <div className="service-main-head">
            <div
              className={`service-icon-container ${
                selectedSubCategoryId === service.subCategoryId._id
                  ? "active"
                  : ""
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
                    service.subCategoryId._id,
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
  };

  // Filter category data to render UI variant buttons
  const filteredCategoryData = useMemo(() => {
    return categoryData.filter((item) => item._id === selectedCategoryId);
  }, [categoryData, selectedCategoryId]);

  return (
    <div className="services">
      {/* Ensure ScrollableTabs always renders, even if services are not found */}
      <ScrollableTabs />

      <div>
        {filteredCategoryData.map((uiItem) => {
          const validVariants = uiItem.uiVariant?.filter(
            (variant) => variant.toLowerCase() !== "none",
          );

          return (
            <div
              key={uiItem._id}
              className="variant"
              style={{
                visibility: validVariants?.length > 0 ? "visible" : "hidden",
              }}
            >
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
        <div className="subcat-services-display">
          <div className="sub-category-display">
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((subCat) => (
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
              <p>No subcategories available for this filter.</p>
            )}
          </div>
          <div className="services-display">
            {displayServices(locationServices)}
          </div>
        </div>
        <div className="cart">
          <CartSummary />
        </div>
      </div>

      <IEpopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        serviceId={selectedServiceId}
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
