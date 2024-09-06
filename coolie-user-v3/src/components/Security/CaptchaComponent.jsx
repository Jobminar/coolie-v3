import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CaptchaComponent = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState(generateRandomString(6));
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleVerify = () => {
    if (input === captcha) {
      confirmAlert({
        title: "Verification Successful",
        message: "Hurray...! You have successfully verified.",
        buttons: [
          {
            label: "OK",
            onClick: () => onVerify(true),
          },
        ],
      });
    } else {
      setError("CAPTCHA does not match, please try again.");
      setCaptcha(generateRandomString(6)); // Regenerate CAPTCHA
      setInput("");
      onVerify(false);
    }
  };

  return (
    <div>
      <p>Please enter the following text:</p>
      <p style={{ fontWeight: "bold", fontSize: "24px", letterSpacing: "3px" }}>
        {captcha}
      </p>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter captcha"
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CaptchaComponent;
