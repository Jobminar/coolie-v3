import React, { useContext, useEffect, memo } from "react";
import { CartContext } from "../../context/CartContext";
import CartFooter from "./CartFooter";
import deleteIcon from "../../assets/images/Delete.png";
import DurationLogo from "../../assets/images/timer.svg";
import "./CartItems.css";

const CartItems = ({ onNext }) => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    // Log cartItems to see updates
    console.log("CartItems updated:", cartItems);
  }, [cartItems]);

  return (
    <div className="cart-items">
      <div className="cart-items-container">
        {cartItems.map((cart) =>
          Array.isArray(cart.items)
            ? cart.items.map((item) => {
                const serviceName = item.serviceId?.name || "Service Name Unavailable";
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
