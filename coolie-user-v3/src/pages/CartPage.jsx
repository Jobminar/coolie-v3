import React from "react";
import CartSummary from "../components/cart/CartSummary";
import "./CartPage.css"; // Import the CSS file for styling

const CartPage = () => {
  return (
    <div className="cart-page">
      <CartSummary fullWidth />
    </div>
  );
};

export default CartPage;
