import React, { useContext, useEffect, memo, useState } from "react";
import { CartContext } from "../../context/CartContext";
import CartFooter from "./CartFooter";
import deleteIcon from "../../assets/images/Delete.png";
import DurationLogo from "../../assets/images/timer.svg";
import { useAuth } from "../../context/AuthContext"; // Import useAuth for address check
import "./CartItems.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styling

const CartItems = ({ onNext }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const { userLocation, userCity } = useAuth(); // Get userLocation and userCity from AuthContext
  const [addressChanged, setAddressChanged] = useState(false); // State to track if address has changed

  useEffect(() => {
    // Assuming we store the user's previous address in sessionStorage
    const previousCity = sessionStorage.getItem("previousCity");
    const previousLatitude = sessionStorage.getItem("previousLatitude");
    const previousLongitude = sessionStorage.getItem("previousLongitude");

    // Check if address has changed
    if (
      userCity !== previousCity ||
      userLocation?.latitude !== previousLatitude ||
      userLocation?.longitude !== previousLongitude
    ) {
      setAddressChanged(true); // Set flag if address has changed
      clearCart(); // Clear the cart when the address changes
    }

    // Update sessionStorage with the latest address
    sessionStorage.setItem("previousCity", userCity);
    sessionStorage.setItem("previousLatitude", userLocation?.latitude || "");
    sessionStorage.setItem("previousLongitude", userLocation?.longitude || "");
  }, [userLocation, userCity, clearCart]);

  useEffect(() => {
    // Log cartItems to see updates
    console.log("CartItems updated:", cartItems);
  }, [cartItems]);

  return (
    <div className="cart-items">
      {/* Show warning message when address has changed */}
      {addressChanged && (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
            viewBox="0 0 16 16"
            role="img"
            aria-label="Warning"
          >
            <path d="M8.982 1.566a1.5 1.5 0 0 1 2.36 0l6.857 11.999a1.5 1.5 0 0 1-1.18 2.434H1.88a1.5 1.5 0 0 1-1.18-2.434L7.556 1.566zM8 5.982a.5.5 0 0 0-.5.5v3.016a.5.5 0 0 0 1 0V6.482a.5.5 0 0 0-.5-.5zm0 5.52a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
          </svg>
          <div>
            <strong>Your address has been changed.</strong> Please explore new
            services available at your location and add them to your cart again.
          </div>
        </div>
      )}

      <div className="cart-items-container">
        {cartItems.map((cart) =>
          Array.isArray(cart.items)
            ? cart.items.map((item) => {
                const serviceName =
                  item.serviceId?.name || "Service Name Unavailable";
                const serviceVariant = item.serviceId?.serviceVariants?.[0];
                const serviceTime = serviceVariant?.serviceTime || "N/A";
                const price = serviceVariant?.price || 0;

                return (
                  <div key={item._id} className="cart-item">
                    <div className="item-details">
                      <h4 id="service-name">{serviceName}</h4>
                      <span className="duration-items">
                        <img id="timer" src={DurationLogo} alt="clock" />
                        <h4>{serviceTime} min</h4>
                        <h4>{item.quantity} Item</h4>
                      </span>
                    </div>
                    <div className="item-actions">
                      <div className="item-action-top">
                        <p className="item-price">₹{price}</p>
                        <button
                          className="delete-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      </div>
                      <div className="quantity">
                        <button
                          id="quantitybtn"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                        >
                          -
                        </button>
                        <span id="quantity-text">{item.quantity}</span>
                        <button
                          id="quantitybtn"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              Math.min(4, item.quantity + 1),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : null,
        )}
      </div>

      <CartFooter onNext={onNext} />
    </div>
  );
};

export default memo(CartItems);
