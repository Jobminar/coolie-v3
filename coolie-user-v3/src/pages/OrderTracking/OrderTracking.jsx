import React, { useEffect, useState, useContext } from "react";
import ProviderTracking from "./ProviderTracking";
import WorkerInfo from "./WorkerInfo";
import Timer from "./Timer";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./OrderTracking.css";
import LoadingPage from "./LoadingPage";
import { useMessaging } from "../../context/MessagingContext";

const OrderTracking = () => {
  const worker = {
    image: "https://via.placeholder.com/150",
    name: "Anil",
    distance: "800m",
    rating: 4.9,
    reviews: 531,
  };

  const location = useLocation();
  const { messageRef } = useMessaging();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("orderCreated") === "true") {
      confirmAlert({
        title: "Order Created",
        message:
          "We will come back to you once a service provider accepts the service.",
        buttons: [{ label: "OK", onClick: () => {} }],
      });
    }

    const checkMessage = () => {
      if (messageRef.current) {
        setIsLoading(false);
      }
    };

    const interval = setInterval(checkMessage, 1000); // Check every second

    return () => clearInterval(interval);
  }, [location, messageRef]);

  const handleCall = () => {
    toast(
      (t) => (
        <span>
          Calling worker...
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast("Call canceled", { icon: "❌" });
            }}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              border: "none",
              background: "#ffcc00",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel Call
          </button>
        </span>
      ),
      {
        icon: "📞",
      },
    );
    console.log("Calling worker...");
  };

  const handleCancel = () => {
    toast("Booking canceled.", {
      icon: "❌",
    });
    console.log("Booking canceled.");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="order-tracking">
      <ProviderTracking />
      <div className="info-container">
        <Timer />
        <hr
          id="info-dividing-line"
          style={{
            backgroundColor: "#444",
            height: "1px",
            border: "none",
            margin: "10px 0",
          }}
        />
        <WorkerInfo
          worker={worker}
          onCall={handleCall}
          onCancel={handleCancel}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default OrderTracking;
