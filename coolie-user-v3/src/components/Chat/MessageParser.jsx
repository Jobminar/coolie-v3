import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.includes("address")) {
      actions.handleOption("Check Saved Address");
    } else if (message.includes("email")) {
      actions.handleOption("Change Email");
    } else if (message.includes("payment")) {
      actions.handleOption("Check Saved Payments");
    } else if (message.includes("booking")) {
      actions.handleOption("Check Bookings");
    } else if (message.includes("cancellation")) {
      actions.handleOption("Charged with Cancellation");
    } else if (message.includes("refund")) {
      actions.handleOption("Request Refund");
    } else if (message.includes("extra")) {
      actions.handleOption("Charged Extra");
    } else {
      actions.handleOption("Something Else");
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
