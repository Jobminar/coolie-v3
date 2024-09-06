import React from "react";
import callIcon from "../../assets/images/provider-dailer.svg";
import messageIcon from "../../assets/images/message-provider.svg";
import OTP from "./OTP";
import "./WorkerInfo.css";

const WorkerInfo = ({ worker, onCall, onCancel }) => {
  return (
    <div className="worker-info">
      <img src={worker.image} alt={worker.name} className="worker-image" />
      <div className="worker-details">
        <div className="worker-name">{worker.name}</div>
        <div className="worker-distance">{worker.distance} (5 mins away)</div>
        <div className="worker-rating">
          ⭐ {worker.rating} ({worker.reviews} reviews)
        </div>
      </div>
      <OTP otp="5599" />
      <div className="worker-actions">
        <button onClick={onCall} className="icon-button provider-call">
          <img src={callIcon} alt="Call" />
        </button>
        <button className="icon-button message-button">
          <img src={messageIcon} alt="Message" />
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default WorkerInfo;
