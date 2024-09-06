import React, { useContext, useState } from "react";
import { OrdersContext } from "../../context/OrdersContext"; // Import OrdersContext
import calendarIcon from "../../assets/images/calender.svg";
import DurationLogo from "../../assets/images/timer.svg";
import Calendar from "./Calendar"; // Ensure Calendar is imported correctly
import "./ItemSchedule.css"; // Ensure you have appropriate CSS styles

const ItemSchedule = () => {
  const { orderDetails, updateItemSchedule } = useContext(OrdersContext); // Use updateItemSchedule from OrdersContext
  const [editingItemId, setEditingItemId] = useState(null); // State to track which item's calendar is being edited

  const toggleCalendar = (itemId) => {
    setEditingItemId(editingItemId === itemId ? null : itemId);
  };

  const handleDateTimeSelect = (dateTime) => {
    updateItemSchedule(dateTime.itemId, dateTime); // Update the item schedule
  };

  return (
    <div className="item-schedule">
      <div className="cart-items-container">
        {orderDetails.map((cart) =>
          Array.isArray(cart.items)
            ? cart.items.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item">
                    <div className="item-details">
                      <h4 id="service-name">{item.serviceId.name}</h4>
                      <span className="duration-items">
                        <img src={DurationLogo} id="timer" alt="Timer Icon" />
                        <h4>
                          {item.serviceId.serviceVariants[0].serviceTime} min
                        </h4>
                        <h4> {item.quantity} Item</h4>
                      </span>
                    </div>
                    <div className="item-actions">
                      <div className="item-action-top">
                        <p className="item-price">
                          <span className="price-span">Price:</span> ₹
                          {item.serviceId.serviceVariants[0].price}
                        </p>
                      </div>
                      <button
                        className="calendar-btn"
                        onClick={() => toggleCalendar(item._id)}
                      >
                        <span className="schedule-span">Schedule</span>
                        <img src={calendarIcon} alt="Calendar Icon" />
                      </button>
                    </div>
                  </div>
                  {editingItemId === item._id && (
                    <div className="item-schedule-selector">
                      <Calendar
                        itemId={item._id}
                        onDateTimeSelect={handleDateTimeSelect}
                      />
                    </div>
                  )}
                </div>
              ))
            : null,
        )}
      </div>
    </div>
  );
};

export default ItemSchedule;
