import React, { useContext, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import CartItems from "./CartItems";
import Address from "./Address";
import Schedule from "./Schedule";
import Checkout from "./Checkout";
import "./CartSummary.css";
import cartIconActive from "../../assets/images/cart-active.svg";
import cartIconInactive from "../../assets/images/cart-inactive.svg";
import locationMarkerActive from "../../assets/images/location-marker-active.svg";
import locationMarkerInactive from "../../assets/images/location-marker-inactive.svg";
import calendarIconActive from "../../assets/images/calender-active.svg";
import calendarIconInactive from "../../assets/images/calender-inactive.svg";
import checkoutIconActive from "../../assets/images/checkout-active.svg";
import checkoutIconInactive from "../../assets/images/checkout-inactive.svg";
import arrowIconActive from "../../assets/images/Arrows-active.svg";
import { OrdersProvider } from "../../context/OrdersContext";
import LoginComponent from "../LoginComponent";

const CartSummary = ({ fullWidth }) => {
  const { cartItems, totalItems, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  // State management
  const [activeTabs, setActiveTabs] = useState(["cart"]);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Refs to track initial render and authentication state
  const initialRender = useRef(true);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const userRef = useRef(user);

  // Effect to handle cart reset when it's cleared
  useEffect(() => {
    if (cartItems.length === 0 && !initialRender.current) {
      console.log("Cart is cleared, resetting to 'cart' tab.");
      setActiveTabs(["cart"]);
    }
    initialRender.current = false;
  }, [cartItems]);

  // Effect to sync authentication state with refs
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
    userRef.current = user;
  }, [isAuthenticated, user]);

  // Effect to reset active tabs on logout
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!isAuthenticatedRef.current) {
      console.log("User logged out, resetting to 'cart' tab.");
      setActiveTabs(["cart"]);
    }
  }, [isAuthenticatedRef.current]);

  // Handles tab progression logic
  const handleNextStep = (nextTab) => {
    if (!isAuthenticatedRef.current) {
      console.log("User not authenticated, showing login modal.");
      setShowLogin(true);
      return;
    }

    setActiveTabs((prevActiveTabs) => {
      const currentIndex = prevActiveTabs.indexOf(nextTab);
      if (currentIndex === -1) {
        return [...prevActiveTabs, nextTab];
      } else {
        return prevActiveTabs.slice(0, currentIndex + 1);
      }
    });
  };

  // Renders the component based on active tab
  const renderActiveComponent = () => {
    try {
      if (activeTabs.includes("checkout")) {
        return <Checkout />;
      } else if (activeTabs.includes("schedule")) {
        return <Schedule onNext={() => handleNextStep("checkout")} />;
      } else if (activeTabs.includes("address")) {
        return <Address onNext={() => handleNextStep("schedule")} />;
      } else {
        return <CartItems onNext={() => handleNextStep("address")} />;
      }
    } catch (err) {
      setError("An error occurred while rendering the component.");
      console.error("Error in renderActiveComponent:", err);
    }
  };

  // Checks if a step is completed
  const isCompleted = (step) => {
    return (
      activeTabs.indexOf(step) !== -1 &&
      activeTabs.indexOf(step) < activeTabs.length - 1
    );
  };

  // Determines which icon to display (active/inactive)
  const getIcon = (step, activeIcon, inactiveIcon) => {
    if (step === "cart" && totalItems === 0) {
      return inactiveIcon; // If no items in cart, use inactive icon
    }
    if (isCompleted(step)) {
      return inactiveIcon; // Use inactive icon if the step is completed
    }
    return activeTabs.includes(step) ? activeIcon : inactiveIcon;
  };

  // Determines the text color class based on step status
  const getTextClass = (step) => {
    if (step === "cart" && totalItems === 0) {
      return "inactive-text"; // If no items in cart, use inactive text color
    }
    if (isCompleted(step)) {
      return "completed-text"; // Use completed text color for completed steps
    }
    return activeTabs.includes(step) ? "active-text" : "inactive-text";
  };

  // Closes the login modal
  const closeModal = () => {
    setShowLogin(false);
  };

  return (
    <OrdersProvider activeTab={activeTabs[activeTabs.length - 1]}>
      <div className={`cart-summary ${fullWidth ? "full-width" : ""}`}>
        {/* Display error if any */}
        {error && <div className="error-message">{error}</div>}

        {/* Show login modal if not authenticated */}
        {showLogin && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <LoginComponent onLoginSuccess={closeModal} />
            </div>
          </div>
        )}

        {!showLogin && (
          <>
            <div className="cart-steps-container">
              <div className="cart-steps">
                {/* Cart Step */}
                <div
                  className={`step ${
                    activeTabs.includes("cart") ? "active" : ""
                  } ${isCompleted("cart") ? "completed" : ""}`}
                  onClick={() => handleNextStep("cart")}
                >
                  <div className="icon-container">
                    <img
                      id="cart-icon"
                      src={getIcon("cart", cartIconActive, cartIconInactive)}
                      alt="Cart"
                    />
                    {totalItems > 0 && (
                      <span className="badge">{totalItems}</span>
                    )}
                  </div>
                  <span className={`step-text ${getTextClass("cart")}`}>
                    Cart
                  </span>
                  {isCompleted("cart") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="tick-icon"
                    />
                  )}
                </div>

                {/* Address Step */}
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("address") ? "active" : ""
                  } ${isCompleted("address") ? "completed" : ""}`}
                  onClick={() => handleNextStep("address")}
                >
                  <div className="icon-container">
                    <img
                      src={getIcon(
                        "address",
                        locationMarkerActive,
                        locationMarkerInactive,
                      )}
                      alt="Address"
                    />
                  </div>
                  <span className={`step-text ${getTextClass("address")}`}>
                    Address
                  </span>
                  {isCompleted("address") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="tick-icon"
                    />
                  )}
                </div>

                {/* Schedule Step */}
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("schedule") ? "active" : ""
                  } ${isCompleted("schedule") ? "completed" : ""}`}
                  onClick={() => handleNextStep("schedule")}
                >
                  <div className="icon-container">
                    <img
                      src={getIcon(
                        "schedule",
                        calendarIconActive,
                        calendarIconInactive,
                      )}
                      alt="Schedule"
                    />
                  </div>
                  <span className={`step-text ${getTextClass("schedule")}`}>
                    Schedule
                  </span>
                  {isCompleted("schedule") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="tick-icon"
                    />
                  )}
                </div>

                {/* Checkout Step */}
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("checkout") ? "active" : ""
                  } ${isCompleted("checkout") ? "completed" : ""}`}
                  onClick={() => handleNextStep("checkout")}
                >
                  <div className="icon-container">
                    <img
                      src={getIcon(
                        "checkout",
                        checkoutIconActive,
                        checkoutIconInactive,
                      )}
                      alt="Checkout"
                    />
                  </div>
                  <span className={`step-text ${getTextClass("checkout")}`}>
                    Checkout
                  </span>
                  {isCompleted("checkout") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="tick-icon"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Render the active component */}
            {renderActiveComponent()}
          </>
        )}
      </div>
    </OrdersProvider>
  );
};

export default CartSummary;
