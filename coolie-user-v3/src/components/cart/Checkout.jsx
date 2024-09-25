import React, { useState, useContext } from "react";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext"; // Import OrdersContext
import PropTypes from "prop-types";
import LZString from "lz-string";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast for notifications
import "./Checkout.css";

const Checkout = ({ onFinalize }) => {
  const { user } = useAuth(); // Get user data from AuthContext
  const { totalItems, totalPrice, createOrder } = useContext(CartContext); // Get total items, price and createOrder from CartContext
  const { initiateOrder } = useContext(OrdersContext); // Get initiateOrder from OrdersContext
  const [couponCode, setCouponCode] = useState(""); // State for coupon code input
  const [isLoading, setIsLoading] = useState(false); // State for loading animation

  // Decompress the phone number from sessionStorage or get it from the user context
  const compressedPhone = sessionStorage.getItem("compressedPhone");
  const phoneNumber = compressedPhone
    ? LZString.decompress(compressedPhone)
    : user?.phone || "";

  console.log("This is the user phone number:", phoneNumber); // Debugging log

  // Handle the coupon code application
  const handleCouponApply = () => {
    toast.success("Coupon Applied: " + couponCode); // Success toast for applied coupon
  };

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script); // Append script to the body
    });
  };

  // Directly trigger Razorpay after creating the order
  const handleRazorpayPayment = async (orderId) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false); // Stop loading if Razorpay fails to load
      return;
    }

    const upiVPA = `${phoneNumber}@ybl`; // UPI VPA formatting

    const options = {
      key: import.meta.env.VITE_RZP_KEY_ID, // Your Razorpay Key from environment
      amount: totalPrice * 100, // Convert to paise
      currency: "INR",
      order_id: orderId, // Use orderId from the createOrder response
      name: "Task-Tigers",
      description: "Test Transaction",
      image: Logo,
      handler: async function (response) {
        console.log("Payment successful:", response);
        try {
          // Assuming initiateOrder handles backend order creation and passing the payment ID
          await initiateOrder(response.razorpay_payment_id);
          toast.success("Order created successfully!");
          onFinalize(); // Callback for post-payment process
        } catch (error) {
          toast.error("Failed to create order.");
          console.error("Error initiating order:", error);
        }
        setIsLoading(false); // Stop loading after successful payment
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: phoneNumber,
        vpa: upiVPA,
      },
      notes: {
        address: user?.address || "",
      },
      theme: {
        color: "#FFBD68",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Initiate payment process after creating an order
  const initiatePayment = async () => {
    setIsLoading(true); // Start loading animation
    toast.loading("Creating order..."); // Show loading toast

    try {
      const orderId = await createOrder(totalPrice); // Assuming createOrder takes totalPrice as argument and returns orderId
      if (orderId) {
        toast.dismiss(); // Dismiss the loading toast after successful order creation
        await handleRazorpayPayment(orderId); // Open Razorpay with the received orderId
      } else {
        toast.error("Failed to create order.");
        setIsLoading(false); // Stop loading if order creation fails
      }
    } catch (error) {
      toast.error("Error initiating payment.");
      console.error("Failed to create order:", error);
      setIsLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <div className="checkout-container">
      {/* Toast notifications */}
      <Toaster limit={1} />

      {/* Coupon Section */}
      <div className="coupon-section">
        <h4>Use a Coupon Code</h4>
        <div className="coupon-code">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleCouponApply}>Apply</button>
        </div>
      </div>

      {/* Checkout Summary Section */}
      <div className="checkout-summary">
        <h5>{totalItems} Items</h5>
        <p>₹{totalPrice.toFixed(2)}</p>

        {/* Disable the button when loading */}
        <button
          onClick={initiatePayment}
          className="confirm-payment-btn"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

Checkout.propTypes = {
  onFinalize: PropTypes.func.isRequired, // Prop validation for onFinalize callback
};

export default Checkout;
