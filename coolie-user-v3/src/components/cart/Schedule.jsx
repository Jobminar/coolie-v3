import React, { useState, useContext } from "react";
import { FaEdit, FaArrowLeft } from "react-icons/fa"; // Import FaArrowLeft instead of FaSave
import Calendar from "./Calendar"; // Import the Calendar component
import ItemSchedule from "./ItemSchedule"; // Import the ItemSchedule component
import ScheduleFooter from "./ScheduleFooter";
import { OrdersContext } from "../../context/OrdersContext"; // Import OrdersContext
import "./Schedule.css";

const Schedule = ({ onNext }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between Calendar and ItemSchedule
  const [applyToAll, setApplyToAll] = useState(true); // State to apply the date to all items
  const { updateAllItemSchedules, updateItemSchedule, orderDetails } =
    useContext(OrdersContext); // Destructure necessary functions and data from OrdersContext

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCheckboxChange = (e) => {
    setApplyToAll(e.target.checked);
  };

  const handleDateTimeSelect = (dateTime) => {
    if (applyToAll) {
      updateAllItemSchedules(dateTime); // Update the schedule for all items
    } else {
      updateItemSchedule(dateTime.itemId, dateTime); // Update the schedule for a specific item
    }
  };

  return (
    <div className="schedule-container">
      <button className="editing-btn" onClick={toggleEdit}>
        {isEditing ? <FaArrowLeft /> : <FaEdit />}
        <span>
          I would like to have {isEditing ? "same" : "different"} slots for
          services
        </span>
      </button>
      <br />
      {!isEditing && (
        <label className="apply-to-all-checkbox">
          <input
            type="checkbox"
            checked={applyToAll}
            onChange={handleCheckboxChange}
            id="applyForAll"
          />
          <span>Apply same for all</span>
        </label>
      )}
      {isEditing ? (
        <ItemSchedule orderDetails={orderDetails} />
      ) : (
        <Calendar onDateTimeSelect={handleDateTimeSelect} />
      )}
      <ScheduleFooter onNext={onNext} />
    </div>
  );
};

export default Schedule;
