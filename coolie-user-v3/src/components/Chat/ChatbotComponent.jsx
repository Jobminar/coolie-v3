import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./ChatbotStyles.css";
import FlashScreen from "./FlashScreen"; // Import the flash screen component
import config from "../../config/chatbotConfig";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const MyComponent = () => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  const handleDismissFlashScreen = () => {
    setShowFlashScreen(false);
  };

  return (
    <div className="chatbot-container">
      {showFlashScreen && <FlashScreen onDismiss={handleDismissFlashScreen} />}
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default MyComponent;
