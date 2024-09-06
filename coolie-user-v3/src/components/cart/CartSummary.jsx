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
  const { cartItems, totalItems } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTabs, setActiveTabs] = useState(["cart"]);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const initialRender = useRef(true);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const userRef = useRef(user);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
    userRef.current = user;
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!isAuthenticatedRef.current) {
      setActiveTabs(["cart"]); // Reset active tabs when the user logs out
    }
  }, [isAuthenticatedRef.current]);

  const handleNextStep = (nextTab) => {
    if (!isAuthenticatedRef.current) {
      setShowLogin(true); // Show the login component if not authenticated
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

  const isCompleted = (step) => {
    return (
      activeTabs.indexOf(step) !== -1 &&
      activeTabs.indexOf(step) < activeTabs.length - 1
    );
  };

  const getIcon = (step, activeIcon, inactiveIcon) => {
    if (step === "cart" && totalItems === 0) {
      return inactiveIcon; // If no items in cart, use inactive icon
    }
    if (isCompleted(step)) {
      return inactiveIcon;
    }
    return activeTabs.includes(step) ? activeIcon : inactiveIcon;
  };

  const getTextClass = (step) => {
    if (step === "cart" && totalItems === 0) {
      return "inactive-text"; // If no items in cart, use inactive text color
    }
    if (isCompleted(step)) {
      return "completed-text"; // Text color for completed steps
    }
    return activeTabs.includes(step) ? "active-text" : "inactive-text";
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  return (
    <OrdersProvider activeTab={activeTabs[activeTabs.length - 1]}>
      <div className={`cart-summary ${fullWidth ? "full-width" : ""}`}>
        {error && <div className="error-message">{error}</div>}
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
            {renderActiveComponent()}
          </>
        )}
      </div>
    </OrdersProvider>
  );
};

export default CartSummary;
