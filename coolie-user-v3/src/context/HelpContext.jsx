// src/HelpContext.jsx
import React, { createContext, useContext } from "react";

const HelpContext = createContext();

export const useHelpContext = () => useContext(HelpContext);

const HelpProvider = ({ children }) => {
  const userId = "fakeUserId"; // Use a fake user ID for now
  const orderId = "fakeOrderId"; // Use a fake order ID for now
  const image = "https://example.com/fake-image.jpg"; // Use a fake image URL for now

  return (
    <HelpContext.Provider value={{ userId, orderId, image }}>
      {children}
    </HelpContext.Provider>
  );
};

export default HelpProvider;
