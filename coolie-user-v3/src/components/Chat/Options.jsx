// src/components/Chat/Options.jsx
import React from "react";
import styled from "styled-components";

const Options = ({ actionProvider, userId, orderId }) => {
  const options = [
    {
      text: "Check Saved Address",
      response:
        "You can check your saved addresses under the 'Account' section in the app.",
    },
    {
      text: "Change Email",
      response:
        "To change your email, go to 'Account Settings' and select 'Change Email'.",
    },
    {
      text: "Check Saved Payments",
      response:
        "Your saved payment methods are available under 'Payment Methods' in the 'Account' section.",
    },
    {
      text: "Check Bookings",
      response: "Your bookings can be viewed under the 'My Bookings' section.",
    },
    {
      text: "Charged with Cancellation",
      response:
        "If you were charged for a cancellation, please provide your Order ID, and we will look into it.",
    },
    {
      text: "Request Refund",
      response:
        "To request a refund, please provide your Order ID and the reason for the refund request.",
    },
    {
      text: "Charged Extra",
      response:
        "If you were charged extra, please provide your Order ID for further investigation.",
    },
    {
      text: "Something Else",
      response:
        "Please describe your issue, and we will assist you accordingly.",
    },
    {
      text: "Provider Demanded Extra Charge",
      response:
        "If the provider demanded an extra charge, please provide your Order ID and details of the issue.",
    },
    {
      text: "Provider Left Job Unfinished",
      response:
        "If the provider left the job unfinished, please provide your Order ID and describe the issue.",
    },
  ];

  return (
    <OptionsContainer>
      {options.map((option, index) => (
        <OptionButton
          key={index}
          onClick={() =>
            actionProvider.handleUserSelection(option, userId, orderId)
          }
        >
          {option.text}
        </OptionButton>
      ))}
    </OptionsContainer>
  );
};

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OptionButton = styled.button`
  background-color: #f3f6fc;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  font-family: "Roboto", sans-serif;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default Options;
