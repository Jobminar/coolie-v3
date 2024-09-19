import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LZString from "lz-string"; // Import LZString for decompression
import "./LoginComponent.css";
import coolieLogo from "../assets/images/brand-logo.svg";

const LoginComponent = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { sendOtp, login } = useAuth(); // Access sendOtp and login from AuthContext

  // Function to handle sending OTP
  const handleSendOtp = async () => {
    await sendOtp({ phone });
    setOtpSent(true);
  };

  // Function to handle login
  const handleLogin = async () => {
    const success = await login({ phone, otp });
    if (success) {
      onLoginSuccess();
      // Remove the OTP from sessionStorage after successful login
      sessionStorage.removeItem("compressedOtp");
      navigate("/home");
    }
  };

  // Auto-fill OTP if it exists in sessionStorage and log it
  useEffect(() => {
    const compressedOtp = sessionStorage.getItem("compressedOtp");
    if (compressedOtp) {
      const decompressedOtp = LZString.decompress(compressedOtp); // Decompress the stored OTP
      setOtp(decompressedOtp); // Auto-fill OTP field
      console.log("Auto-filled OTP:", decompressedOtp); // Log the OTP
    }
  }, [otpSent]); // Only auto-fill OTP when it's been sent

  // Add glow effect to the button if the phone number is 10 digits
  useEffect(() => {
    const button = document.querySelector(".send-otp-button");
    if (phone.length === 10) {
      button.classList.add("glow");
    } else {
      button.classList.remove("glow");
    }
  }, [phone]);

  return (
    <div className="login-box">
      <img src={coolieLogo} alt="Coolie Logo" className="coolie-logo" />
      <div className="login-box-header">
        <h4>Login</h4>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Show Send OTP button if OTP hasn't been sent yet */}
      {!otpSent && (
        <button className="send-otp-button" onClick={handleSendOtp}>
          Send OTP
        </button>
      )}

      {/* Show OTP input and Login button after OTP is sent */}
      {otpSent && (
        <>
          <div className="input-group">
            <input
              type="number"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
            />
          </div>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
