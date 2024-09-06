import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import googleLogo from "../assets/images/google-logo.png";
import coolieLogo from "../assets/images/coolie-logo.png";

const LoginComponent = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [googleLoginSuccess, setGoogleLoginSuccess] = useState(false);
  const { sendOtp, login, loginWithGoogle, googleUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    await sendOtp({ phone });
    setOtpSent(true);
  };

  const handleLogin = async () => {
    const success = await login({ phone, otp });
    if (success) {
      onLoginSuccess();
      navigate("/home");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setGoogleLoginSuccess(true);
  };

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
      <div className="login-box-header">
        <h4>Login</h4>
        <img src={coolieLogo} alt="Coolie Logo" className="coolie-logo" />
      </div>
      {googleLoginSuccess && (
        <p>
          Subscription with Google successful, now verify your mobile number to
          continue
        </p>
      )}
      <div className="input-group">
        <input
          type="text"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="send-otp-button" onClick={handleSendOtp}>
          Send OTP
        </button>
      </div>
      {otpSent && (
        <div className="input-group">
          <input
            type="number"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
        </div>
      )}
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

      {/* <p>
        Don't have an account? <a href="/signup">signup</a>
      </p>
      <div className="oval-shaped-div">
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src={googleLogo} alt="Google" className="google-logo" />
        </button>
      </div> */}
    </div>
  );
};

export default LoginComponent;
