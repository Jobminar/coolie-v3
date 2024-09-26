import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext"; // For accessing user data
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import savemoney from "../../../assets/images/savemoney.svg";
import offer from "../../../assets/images/offer.svg";
import add from "../../../assets/images/add.png";
import minus from "../../../assets/images/minus.png";
import "./Packages.css";
import CurrentPackage from "./CurrentPackage";

const Packages = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const [faq, setFaqs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null); // Track open FAQ for toggling
  const [loading, setLoading] = useState(false); // Track loading status for Razorpay
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // For showing a spinner during payment process

  // Fallback to userId from sessionStorage if not available in AuthContext
  const userId = user?._id || sessionStorage.getItem("userId");
  const userIdRef = useRef(user?._id || sessionStorage.getItem("userId"));
  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(
          "{Azure_Base_url}$/v1.0/users/faq-package",
        );
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch FAQs.");
      }
    };
    fetchFaqs();
  }, []);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "{Azure_Base_url}$/v1.0/admin/admin-user-package",
        );
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch packages.");
      }
    };
    fetchPackages();
  }, []);

  // Validate package data before sending it to the API
  const validatePackageData = (pkg, paymentId) => {
    if (!userId) {
      console.log("User ID is missing.");
      toast.error("User ID is required.");
      return false;
    }
    if (!pkg.packageName) {
      console.log("Package name is missing.");
      toast.error("Package name is required.");
      return false;
    }
    if (!pkg.priceRs || pkg.priceRs <= 0) {
      console.log("Price is invalid.");
      toast.error("Valid price is required.");
      return false;
    }
    if (!pkg.validity) {
      console.log("Validity is missing.");
      toast.error("Validity is required.");
      return false;
    }
    if (!paymentId) {
      console.log("Payment ID is missing.");
      toast.error("Payment ID is required.");
      return false;
    }
    return true;
  };

  // Razorpay Payment Initialization
  const initializeRazorpay = async (pkg) => {
    setLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = async () => {
      const options = {
        key: import.meta.env.VITE_RZP_KEY_ID, // Add Razorpay Key from env
        amount: pkg.priceRs * 100, // Convert to paise
        currency: "INR",
        name: "Task-Tigers",
        description: `${pkg.packageName} Package`,
        handler: async function (response) {
          console.log("Payment Response:", response); // Capture payment response
          toast.success("Payment successful!");

          // Validate the data before sending it to the API
          if (validatePackageData(pkg, response.razorpay_payment_id)) {
            const createPackageResponse = await createPackageForUser(
              pkg,
              response.razorpay_payment_id,
            );
            if (createPackageResponse) {
              toast.success("Package successfully assigned to user!");
            }
          }
        },
        prefill: {
          name: user?.name || "", // Prefill name from user context
          email: user?.email || "", // Prefill email from user context
          contact: user?.phone || "", // Prefill contact number from user context
        },
        theme: {
          color: "#FFBD68", // Set theme color for Razorpay checkout
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    script.onerror = () => {
      toast.error(
        "Failed to load Razorpay. Please check your internet connection.",
      );
      setLoading(false);
    };
    document.body.appendChild(script);
  };

  // Create package for user after successful payment
  const createPackageForUser = async (pkg, paymentId) => {
    setIsPaymentProcessing(true); // Show spinner during package creation
    const packageData = {
      userId,
      packageName: pkg.packageName,
      priceRs: pkg.priceRs,
      validity: pkg.validity,
      discount: pkg.discount,
      comments: pkg.comments,
      description: pkg.description,
      paymentId: paymentId, // Use Razorpay payment ID
    };

    try {
      const response = await fetch(
        "{Azure_Base_url}$/v1.0/users/user-packages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(packageData),
        },
      );

      const data = await response.json();
      setIsPaymentProcessing(false); // Hide spinner after completion
      if (response.ok) {
        console.log("Package created successfully:", data);
        return data;
      } else {
        console.error("Failed to create package for user:", data);
        toast.error("Error while creating user package.");
        return null;
      }
    } catch (err) {
      console.error("Error in creating user package:", err);
      toast.error("Failed to create package for user.");
      setIsPaymentProcessing(false);
      return null;
    }
  };

  // Toggle FAQ answer visibility
  const handleToggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index); // Open/close the answer
  };

  return (
    <>
      <div className="save-money-main-con">
        <CurrentPackage userId={userIdRef.current} />
        <div className="savemoney-svg">
          <img src={savemoney} alt="Save Money" />
        </div>
        <h2 className="s-m-headding">Save more % on Bookings</h2>
        <div className="s-m-main-con">
          <div className="s-m-sub-con">
            <p className="plus">Plus benefits</p>
            <img src={offer} alt="Offer" className="offer-s-m-badge" />
            <p className="percent-off">Get 10% off on all categories</p>
            <p className="enjoy">
              Enjoy 10% discount on all bookings in any category
            </p>
          </div>

          <div className="s-m-p-sub-con">
            {Array.isArray(packages) && packages.length > 0 ? (
              packages.map((item, index) => (
                <div className="package-main-con" key={index}>
                  <div className="package-sub-con">
                    <p>Validity: {item.validity}</p>
                    <p>Price: ₹{item.priceRs}</p>
                    <button
                      className="add-p-button"
                      onClick={() => {
                        initializeRazorpay(item);
                      }}
                    >
                      Buy {item.packageName}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No packages available</p>
            )}
          </div>
        </div>

        <div className="f-a-q-main-con">
          <h2 className="faq-headding">FAQ'S</h2>
          <p className="faq-sub-headding">Frequently Asked Questions</p>
          <p className="faq-content">Have questions? We are here to help you</p>
          {Array.isArray(faq) && faq.length > 0 ? (
            faq.map((item, index) => (
              <div key={index} className="faq-sub-con">
                <div className="question-con">
                  <p className="question">{item.question}</p>
                  <img
                    src={add}
                    alt="add"
                    className="add-button"
                    style={{
                      display: openFaqIndex === index ? "none" : "block",
                    }}
                    onClick={() => handleToggleFaq(index)}
                  />
                  <img
                    src={minus}
                    alt="minus"
                    className="minus-button"
                    style={{
                      display: openFaqIndex === index ? "block" : "none",
                    }}
                    onClick={() => handleToggleFaq(index)}
                  />
                </div>
                <p
                  className="answer"
                  style={{ display: openFaqIndex === index ? "block" : "none" }}
                >
                  {item.answer}
                </p>
              </div>
            ))
          ) : (
            <p>No FAQs available</p>
          )}
        </div>
      </div>

      {/* Loading spinner during payment initialization */}
      {loading && <p>Loading Razorpay...</p>}

      {/* Payment processing spinner */}
      {isPaymentProcessing && <p>Processing your payment...</p>}

      {/* Toastify notifications */}
      <ToastContainer />
    </>
  );
};

export default Packages;
