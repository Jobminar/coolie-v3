import React, { useState, useContext } from "react";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import { CartContext } from "../../context/CartContext"; // Import CartContext
import { OrdersContext } from "../../context/OrdersContext"; // Import OrdersContext
import PropTypes from "prop-types";
import LZString from "lz-string";
import "./Checkout.css";

const Checkout = ({ onFinalize }) => {
  const { user } = useAuth(); // Get user data from AuthContext
  const { totalItems, totalPrice } = useContext(CartContext); // Get total items and total price from CartContext
  const { createOrder } = useContext(OrdersContext); // Get createOrder from OrdersContext
  const [couponCode, setCouponCode] = useState(""); // State to handle coupon code input

  // Razorpay key from environment variables
  const RazorKey = import.meta.env.VITE_RZP_KEY_ID;

  // Decompress the phone number from sessionStorage or get it from the user context
  const compressedPhone = sessionStorage.getItem("compressedPhone");
  const phoneNumber = compressedPhone
    ? LZString.decompress(compressedPhone)
    : user?.phone || ""; // Fallback to user's phone number if not found in sessionStorage

  console.log("This is the user phone number:", phoneNumber);
  console.log("this is other phone", user?.phone); // Log the phone number for debugging

  // Handle the coupon code application
  const handleCouponApply = () => {
    console.log("Coupon Applied:", couponCode); // Log the coupon code for debugging
    // Handle coupon validation or adjustments to the final price here
  };

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay script loaded successfully"); // Log when the script is successfully loaded
        resolve(true);
      };
      script.onerror = () => {
        console.log("Failed to load Razorpay script"); // Log if the script fails to load
        resolve(false);
      };
      document.body.appendChild(script); // Append script to the body
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    console.log("This is the user phone number:", phoneNumber);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Concatenate phone number with UPI provider suffix (in this case @ybl)
    const upiVPA = `${phoneNumber}@ybl`; // You can change @ybl to any UPI provider suffix

    console.log("Generated UPI VPA:", upiVPA); // Log the generated UPI VPA

    const options = {
      key: RazorKey, // Razorpay key from environment variables
      amount: totalPrice * 100, // Amount in paise (multiply by 100 to convert from INR)
      currency: "INR",
      name: "Task-Tigers",
      description: "Test Transaction",
      image: Logo, // Company logo or branding
      handler: function (response) {
        // Log all Razorpay responses for debugging
        console.log("Payment successful:", response);
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);

        // Create an order with the payment ID after a successful transaction
        createOrder(response.razorpay_payment_id);

        // Finalize the payment and trigger any other processes
        onFinalize();
      },
      prefill: {
        name: user?.name || "", // Prefill name from user context
        email: user?.email || "", // Prefill email from user context
        contact: phoneNumber, // Prefill contact with phone number
        vpa: upiVPA, // Set UPI ID (VPA) for UPI payments
      },
      notes: {
        address: user?.address || "", // Any additional notes or user address
      },
      theme: {
        color: "#FFBD68", // Set theme color for Razorpay checkout
      },
    };

    console.log("Razorpay payment options:", options); // Log Razorpay options before opening payment window

    const paymentObject = new window.Razorpay(options); // Create Razorpay payment object
    paymentObject.open(); // Open the Razorpay checkout window
  };

  // Handle confirm payment button click
  const handleConfirmPayment = () => {
    console.log("Initiating Razorpay Payment"); // Log when payment is initiated
    handleRazorpayPayment(); // Call the payment function
  };

  return (
    <div className="checkout-container">
      {/* Coupon Section */}
      <div className="coupon-section">
        <h4>Use a Coupon Code while payment</h4>
        <div className="coupon-code">
          <input
            type="text"
            placeholder="USE CODE 1234567"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)} // Update coupon code state
          />
          <button className="apply-coupon-btn" onClick={handleCouponApply}>
            APPLY
          </button>
        </div>
      </div>

      {/* Checkout Summary Section */}
      <div className="checkout-summary">
        <div className="checkout-total-info">
          <h5>{totalItems} Items</h5>
          <p>₹{totalPrice.toFixed(2)}</p> {/* Display the total price */}
        </div>
        <div className="checkout-total-button">
          <button
            className="confirm-payment-btn"
            onClick={handleConfirmPayment}
          >
            CONFIRM PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

Checkout.propTypes = {
  onFinalize: PropTypes.func.isRequired, // Validate that onFinalize is a required function
};

export default Checkout;
