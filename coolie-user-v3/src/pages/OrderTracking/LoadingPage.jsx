import React from "react";
import "./LoadingPage.css";
import SearchGif from "../../assets/images/Search.gif";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <img src={SearchGif} alt="Searching for provider" />
        <h2>
          Your Order has been made and we are matching with a best provider
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h2>
      </div>
    </div>
  );
};

export default LoadingPage;
