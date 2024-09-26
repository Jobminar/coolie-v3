import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./Bookings.css";
import jobValue from "../../../assets/images/job-value.png";
import OnlinePayment from "../../../assets/images/online-payment.png";
import BookingDetails from "./BookingDetails"; // Import the new component

const Bookings = () => {
  const { userId: authUserId } = useAuth();
  const userId = authUserId || sessionStorage.getItem("userId");

  const [orders, setOrders] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null); // State to track selected booking

  // fetching user details
  useEffect(() => {
    console.log(userId, "userid in bookings");
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          `https://api-tasktigers.azurewebsites.net/v1.0/users/userAuth/${userId}`,
        );
        const data = await response.json();
        setUsername(data.name);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    // fetch orders by userid
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://api-tasktigers.azurewebsites.net/v1.0/users/order/${userId}`,
        );
        const data = await response.json();
        setOrders(data);
        console.log(data, "orders in booking page");
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userId) {
      fetchUsername();
      fetchOrders();
    } else {
      console.error("No userId found");
    }
  }, [userId]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking); // Set the clicked booking as the selected one
  };

  const formatDate = (day, month) => {
    const date = new Date(2024, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      // weekday: "short",
      day: "2-digit",
      month: "short",
      // year: "numeric",
    });
  };

  return (
    <div className="bookings-container">
      <h1 className="bookings-title">My Bookings</h1>
      {selectedBooking ? (
        <BookingDetails booking={selectedBooking} /> // Render the BookingDetails component if a booking is selected
      ) : (
        <div className="order-cards-container">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
                onClick={() => handleBookingClick(order)} // Set the booking on click
              >
                <div className="order-card-header">
                  <h1 id="booking-name">{username || "Username"}</h1>
                  <h2 id="selected-time">
                    {order.items[0]?.selectedTime || "Time"}
                  </h2>
                </div>
                <div className="order-card-body">
                  <div className="pricing-details">
                    <p id="jobs-pricing">
                      <img
                        src={jobValue}
                        alt="Job Value Icon"
                        className="icon"
                      />
                      Job value: ₹{" "}
                      {order.items[0]?.serviceId?.serviceVariants?.[0]?.price ||
                        "N/A"}
                    </p>
                    <p>
                      <img
                        src={OnlinePayment}
                        alt="Online Payment Icon"
                        className="icon"
                      />
                      Online Payments: ₹ {order.paymentId ? 0 : "N/A"}
                    </p>
                  </div>
                  <div className="booking-date">
                    <p id="booking-day">
                      {formatDate(
                        order.items[0]?.selectedDate,
                        order.items[0]?.selectedMonth,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;
