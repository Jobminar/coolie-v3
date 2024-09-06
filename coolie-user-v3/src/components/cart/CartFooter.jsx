import React, { useContext } from "react";
import "./CartFooter.css";
import { CartContext } from "../../context/CartContext";

const CartFooter = ({ onNext }) => {
  const { totalItems, totalPrice } = useContext(CartContext);

  return (
    <div className="cart-total">
      <div className="cart-total-info">
        <h5>{totalItems} Items</h5>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="cart-total-button">
        <button className="go-to-address-btn" onClick={() => onNext("address")}>
          Confirm address
        </button>
      </div>
    </div>
  );
};

export default CartFooter;
