import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { messaging } from "../config/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    async function requestPermission() {
      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        try {
          console.log("Attempting to retrieve FCM token...");
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });
          if (currentToken) {
            setToken(currentToken);
            console.log("FCM Token retrieved:", currentToken);
            await sendTokenToServer(currentToken, storedUserId);
          } else {
            console.log(
              "No registration token available. Request permission to generate one.",
            );
          }
        } catch (error) {
          console.log("An error occurred while retrieving token. ", error);
        }
      } else if (permission === "denied") {
        console.log("Notification permission denied.");
        confirmAlert({
          title: "Notifications Blocked",
          message:
            "Please enable notifications in your browser settings to receive updates.",
          buttons: [
            {
              label: "OK",
              onClick: () => {},
            },
          ],
        });
      } else {
        console.log("Notification permission not granted.");
      }
    }

    requestPermission();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received from backend:", payload);
      messageRef.current = payload;
      confirmAlert({
        title: payload.notification.title,
        message: `${payload.notification.body}\n\nOrder ID: ${payload.data.orderId}`,
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
      });
    });
  }, []);

  const sendNotification = (notification) => {
    console.log("Sending notification:", notification);
    confirmAlert({
      title: notification.title,
      message: notification.body,
      buttons: [
        {
          label: "OK",
          onClick: () => {},
        },
      ],
    });
  };

  const sendTokenToServer = async (token, userId) => {
    console.log("Sending FCM token to server:", token, "for user:", userId);
    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/user-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to store FCM token");
      }
      console.log("FCM token successfully sent to server");
    } catch (error) {
      console.error("Error sending FCM token to server:", error);
    }
  };

  return (
    <MessagingContext.Provider value={{ token, sendNotification, messageRef }}>
      {children}
    </MessagingContext.Provider>
  );
};

export { MessagingContext };
