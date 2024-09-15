import React, { useContext, useEffect, useRef, useState } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import dropdownIcon from "../../assets/images/dropdown.svg";
import { toast } from "react-hot-toast"; // Import toast
import "./ScrollableTabs.css";

const ScrollableTabs = () => {
  const {
    categoryData,
    locationCat,
    selectedCategoryId,
    setSelectedCategoryId,
    error,
  } = useContext(CategoryContext);
  const [selectedCategoryIdLocal, setSelectedCategoryIdLocal] =
    useState(selectedCategoryId);
  const containerRef = useRef(null);
  const buttonWidth = 70;

  const getTabWidth = () => {
    const containerWidth = containerRef.current
      ? containerRef.current.offsetWidth
      : window.innerWidth;
    if (containerWidth >= 1789) return 250;
    if (containerWidth >= 1200) return 200;
    if (containerWidth >= 768) return 160;
    return 128;
  };

  const getVisibleTabs = () => {
    const containerWidth = containerRef.current
      ? containerRef.current.offsetWidth
      : window.innerWidth;
    const tabWidth = getTabWidth();
    return Math.floor((containerWidth - buttonWidth * 2) / tabWidth);
  };

  const visibleTabs = getVisibleTabs();

  useEffect(() => {
    const handleResize = () => {
      const newVisibleTabs = getVisibleTabs();
      if (newVisibleTabs !== visibleTabs) {
        setSelectedCategoryIdLocal(selectedCategoryId); // Trigger re-render on resize
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedCategoryId, visibleTabs]);

  useEffect(() => {
    setSelectedCategoryIdLocal(selectedCategoryId);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryIdLocal && containerRef.current) {
      const selectedTab = document.getElementById(
        `tab-${selectedCategoryIdLocal}`,
      );
      if (selectedTab) {
        const tabLeftPosition = selectedTab.offsetLeft;
        const buttonWidthWithPadding = buttonWidth + 15;

        // Scroll the selected tab to the start of the container
        containerRef.current.scrollTo({
          left: tabLeftPosition - buttonWidthWithPadding,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategoryIdLocal]);

  const handleCategoryClick = (id) => {
    // Check if the category is in locationCat
    const isMatchedCategory = locationCat.some((cat) => cat._id === id);

    if (isMatchedCategory) {
      // Proceed as normal
      setSelectedCategoryId(id);
      setSelectedCategoryIdLocal(id);
    } else {
      // Show toast message
      toast.error("We are currently not serving in your place");
    }
  };

  const scrollLeft = () => {
    const tabWidth = getTabWidth();
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -tabWidth * visibleTabs,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const tabWidth = getTabWidth();
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: tabWidth * visibleTabs,
        behavior: "smooth",
      });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  // Display all categories without special styling for matched categories
  return (
    <div className="scrollable-tabs-wrapper">
      {/* Left Scroll Button */}
      <button className="scroll-button left" onClick={scrollLeft}>
        <FaChevronLeft />
      </button>

      {/* Scrollable Tabs Container */}
      <div className="scrollable-tabs-container" ref={containerRef}>
        {categoryData.map((category, index) => (
          <div
            key={index}
            id={`tab-${category._id}`}
            className={`scrollable-tab ${
              selectedCategoryIdLocal === category._id ? "selected" : ""
            }`} // Remove 'matched' class
            onClick={() => handleCategoryClick(category._id)}
          >
            {/* Category Image */}
            <div className="tab-image-container">
              <img
                src={category.imageKey}
                alt={category.name}
                className="tab-image"
              />
            </div>
            {/* Category Name */}
            <div className="tab-text-wrapper">
              <p>{category.name}</p>
              {selectedCategoryIdLocal === category._id && (
                <img
                  src={dropdownIcon}
                  alt="Dropdown Icon"
                  className="dropdown-icon"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button className="scroll-button right" onClick={scrollRight}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ScrollableTabs;
