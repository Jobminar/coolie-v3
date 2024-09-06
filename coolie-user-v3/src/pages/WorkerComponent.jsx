import React, { useContext, useEffect, useState } from "react";
import { MessagingContext } from "../context/MessagingContext";

const WorkerComponent = () => {
  const { messageRef } = useContext(MessagingContext);
  const [message, setMessage] = useState(messageRef.current);

  useEffect(() => {
    setMessage(messageRef.current);
  }, [messageRef.current]);

  const providerDetails = JSON.parse(message.data.providerDetails || "{}");

  return (
    <div>
      <h2>{message.notification.title}</h2>
      <p>{message.notification.body}</p>
      <div>
        <strong>Order ID:</strong> {message.data.orderId}
      </div>
      <div>
        <strong>Provider Name:</strong> {providerDetails.name}
      </div>
      <div>
        <strong>Provider Phone:</strong> {providerDetails.phone}
      </div>
      <div>
        <strong>OTP:</strong> {message.data.otp}
      </div>
    </div>
  );
};

export default WorkerComponent;
