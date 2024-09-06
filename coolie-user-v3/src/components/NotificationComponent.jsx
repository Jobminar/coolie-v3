import React from "react";
import { useMessaging } from "../context/MessagingContext";

const NotificationComponent = () => {
  const { token } = useMessaging();

  return (
    <div>
      <h2>Notification Component</h2>
      {token ? <p>FCM Token: {token}</p> : <p>No FCM Token available</p>}
    </div>
  );
};

export default NotificationComponent;
