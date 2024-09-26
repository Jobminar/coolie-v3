import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../context/CartContext"; // Import CartContext
import "./IEpopup.css";
import FAQ from "./FAQ"; // Import the FAQ component

const IEpopup = ({ isOpen, onClose, serviceId }) => {
  const [serviceDetails, setServiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bannerImageAdded, setBannerImageAdded] = useState(false); // State to track if the banner image has been added

  const { addToCart } = useContext(CartContext); // Access the addToCart function from CartContext

  const generateRandomColor = () => {
    const colors = [
      "rgba(255, 239, 213, 0.5)",
      "rgba(240, 255, 240, 0.5)",
      "rgba(240, 248, 255, 0.5)",
      "rgba(255, 250, 240, 0.5)",
      "rgba(245, 245, 220, 0.5)",
      "rgba(255, 228, 225, 0.5)",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    if (isOpen) {
      const fetchServiceDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            "{Azure_Base_url}$/v1.0/core/inclusion-exclusion",
          );

          const filteredDetails = response.data.filter(
            (item) => item.serviceId && item.serviceId._id === serviceId,
          );

          setServiceDetails(filteredDetails);
        } catch (error) {
          setError("Failed to load service details");
        } finally {
          setLoading(false);
        }
      };

      fetchServiceDetails();
    }
  }, [isOpen, serviceId]);

  const getUniqueDescription = (details) => {
    const descriptions = details.map(
      (item) => `${item.serviceId?.description || ""} ${item.description}`,
    );
    const uniqueDescriptions = [...new Set(descriptions)];
    return uniqueDescriptions.join(". ");
  };

  const handleAddBanner = (bannerImage) => {
    const itemToAdd = {
      serviceId: serviceDetails[0].serviceId._id,
      categoryId: serviceDetails[0].serviceId.categoryId,
      subCategoryId: serviceDetails[0].serviceId.subCategoryId,
      quantity: 1,
    };

    // Add banner to cart
    addToCart(itemToAdd);
    setBannerImageAdded(true); // Set the state to true after adding
    console.log("Banner Image Added:", bannerImage);
  };

  const groupedDetails = serviceDetails.reduce((acc, item) => {
    const existingGroup = acc.find((group) => group.title === item.title);
    if (existingGroup) {
      const existingFeature = existingGroup.features.find(
        (feature) => feature.featureTitle === item.featureTitle,
      );
      if (existingFeature) {
        existingFeature.items.push(...item.listOfItems);
      } else {
        existingGroup.features.push({
          featureTitle: item.featureTitle,
          items: item.listOfItems,
        });
      }
    } else {
      acc.push({
        title: item.title,
        bannerImage: item.bannerImage,
        features: [
          {
            featureTitle: item.featureTitle,
            items: item.listOfItems,
          },
        ],
      });
    }
    return acc;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="ie-popup-overlay" onClick={onClose}>
      <div className="ie-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="ie-popup-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="ie-popup-content">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : serviceDetails.length > 0 ? (
            <>
              <h2>{serviceDetails[0].serviceId.name}</h2>
              <div className="service-description">
                {getUniqueDescription(serviceDetails)}.
              </div>
              {groupedDetails.map((group, index) => (
                <div
                  key={index}
                  className="service-detail-block"
                  style={{ backgroundColor: generateRandomColor() }}
                >
                  <div className="service-banner-section">
                    <div className="service-info">
                      <h3>{group.title}</h3>
                    </div>
                    <div className="banner-image-container">
                      <img
                        src={group.bannerImage}
                        alt="Banner"
                        className="ie-popup-banner-image"
                      />
                      {!bannerImageAdded && (
                        <button
                          className="add-banner-button"
                          onClick={() => handleAddBanner(group.bannerImage)}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                  {group.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-section">
                      <div className="feature-title-container">
                        <h4>{feature.featureTitle}</h4>
                      </div>

                      <div className="service-items">
                        {feature.items.map((listItem, itemIndex) => (
                          <div key={itemIndex} className="item">
                            <img
                              src={listItem.iconImage}
                              alt={listItem.title}
                              className="ie-popup-item-image"
                            />
                            <p>{listItem.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="service-exclusions-card">
                <div className="service-exclusions">
                  <h2 className="exclusions-heading">Excluded</h2>
                  <ul className="exclusions-list">
                    {serviceDetails
                      .flatMap((item) => item.exclusions)
                      .filter(
                        (exclusion, index, self) =>
                          self.indexOf(exclusion) === index,
                      )
                      .map((exclusion, index) => (
                        <li key={index}>{exclusion}</li>
                      ))}
                  </ul>
                </div>
              </div>
              <FAQ serviceId={serviceId} /> {/* Include the FAQ component */}
            </>
          ) : (
            <p>No service details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IEpopup;
