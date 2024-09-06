import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleOption = (option) => {
    let responseMessage = "";
    switch (option) {
      case "Check Saved Address":
        responseMessage =
          "You can check your saved addresses under the 'Account' section in the app.";
        break;
      case "Change Email":
        responseMessage =
          "To change your email, go to 'Account Settings' and select 'Change Email'.";
        break;
      case "Check Saved Payments":
        responseMessage =
          "Your saved payment methods are available under 'Payment Methods' in the 'Account' section.";
        break;
      case "Check Bookings":
        responseMessage =
          "Your bookings can be viewed under the 'My Bookings' section.";
        break;
      case "Charged with Cancellation":
        responseMessage =
          "If you were charged for a cancellation, please provide your Order ID, and we will look into it.";
        break;
      case "Request Refund":
        responseMessage =
          "To request a refund, please provide your Order ID and the reason for the refund request.";
        break;
      case "Charged Extra":
        responseMessage =
          "If you were charged extra, please provide your Order ID for further investigation.";
        break;
      case "Something Else":
        responseMessage =
          "Please describe your issue, and we will assist you accordingly.";
        break;
      default:
        responseMessage =
          "Sorry, I didn't understand that. Can you please rephrase?";
    }

    const botMessage = createChatBotMessage(responseMessage, {
      className: "bot-message",
    });
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleOption,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
