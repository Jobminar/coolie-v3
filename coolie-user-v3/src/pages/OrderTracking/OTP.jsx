import React from "react";

const OTP = ({ otp }) => {
  return (
    <div className="otp-container">
      <h3>Before Provider starts the work</h3>
      <h4>Your OTP Pin</h4>
      <div className="otp-digits">
        {otp.split("").map((digit, index) => (
          <span key={index} className="otp-digit">
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OTP;
