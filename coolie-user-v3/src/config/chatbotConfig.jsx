import { createChatBotMessage } from "react-chatbot-kit";
import React from "react";

const options = [
  "Check Saved Address",
  "Change Email",
  "Check Saved Payments",
  "Check Bookings",
  "Charged with Cancellation",
  "Request Refund",
  "Charged Extra",
  "Something Else",
];

const config = {
  initialMessages: [
    createChatBotMessage("Hello! How can I assist you today?", {
      widget: "options",
      withAvatar: true,
      delay: 500,
      className: "bot-message",
    }),
  ],
  customComponents: {
    botAvatar: (props) => <div className="chatbot-avatar">🤖</div>,
    userAvatar: (props) => <div className="user-avatar">👤</div>,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#f3f6fc",
      color: "#000",
    },
    chatButton: {
      backgroundColor: "#EE8100",
      color: "#000",
    },
    userMessageBox: {
      backgroundColor: "#EE8100",
      color: "#000",
    },
  },
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => (
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => props.actionProvider.handleOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
  ],
};

export default config;
