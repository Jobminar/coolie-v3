import React, { useContext, useEffect, useState } from "react";
import ArrowIconLeft from "../../assets/images/CalenderLeft-arrows.svg";
import ArrowIconRight from "../../assets/images/CalenderRight-arrows.svg";
import { OrdersContext } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";

const Calendar = ({ itemId, onDateTimeSelect }) => {
  const { orderDetails } = useContext(OrdersContext);
  const { userLocation } = useAuth();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const todayDate = today.getDate().toString().padStart(2, "0");
  const todayMonth = today.getMonth();

  const itemSchedule = orderDetails
    .flatMap((cart) => cart.items)
    .find((item) => item._id === itemId);

  const initialDate = itemSchedule?.selectedDate || todayDate;
  const initialTime = itemSchedule?.selectedTime || null;
  const initialMonth = itemSchedule?.selectedMonth || todayMonth;

  useEffect(() => {
    setSelectedDate(initialDate);
    setSelectedTime(initialTime);
    setSelectedMonth(initialMonth);

    calculateAvailableTimes(initialDate);
  }, [itemId]);

  useEffect(() => {
    calculateAvailableTimes(selectedDate);
  }, [selectedDate, selectedMonth]);

  const calculateAvailableTimes = (date) => {
    setLoading(true);

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    const timeslots = [
      { label: "9AM - 10AM", startHour: 9 },
      { label: "10AM - 11AM", startHour: 10 },
      { label: "11AM - 12PM", startHour: 11 },
      { label: "12PM - 1PM", startHour: 12 },
      { label: "1PM - 2PM", startHour: 13 },
      { label: "2PM - 3PM", startHour: 14 },
      { label: "3PM - 4PM", startHour: 15 },
      { label: "4PM - 5PM", startHour: 16 },
      { label: "5PM - 6PM", startHour: 17 },
      { label: "6PM - 7PM", startHour: 18 },
      { label: "7PM - 8PM", startHour: 19 },
      { label: "8PM - 9PM", startHour: 20 },
    ];

    const availableSlots =
      date === todayDate && selectedMonth === todayMonth
        ? timeslots.filter((slot) => slot.startHour > currentHour)
        : timeslots;

    console.log("Available slots after filtering:", availableSlots);

    setAvailableTimes(availableSlots);
    setLoading(false);
  };

  const handlePrevious = () => {
    if (currentOffset > 0) {
      setCurrentOffset(currentOffset - 4);
    }
  };

  const handleNext = () => {
    setCurrentOffset(currentOffset + 4);
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setSelectedMonth(newMonth);

    const newDate = new Date(today.getFullYear(), newMonth, 1)
      .getDate()
      .toString()
      .padStart(2, "0");

    setSelectedDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateTimeSelect) {
      onDateTimeSelect({
        itemId,
        selectedDate: date,
        selectedTime,
        selectedMonth,
      });
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (onDateTimeSelect) {
      onDateTimeSelect({
        itemId,
        selectedDate,
        selectedTime: time,
        selectedMonth,
      });
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date(
    today.getFullYear(),
    selectedMonth,
    today.getDate(),
  );
  currentDate.setDate(currentDate.getDate() + currentOffset);

  const dates = [];
  const days = [];
  for (let i = 0; i < 4; i++) {
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + i);
    dates.push(futureDate.getDate().toString().padStart(2, "0"));
    days.push(
      futureDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
    );
  }

  return (
    <div className="calendar-container">
      <h3>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>{" "}
        {new Date().getFullYear()}
      </h3>
      <p className="scheduled-date">
        You have selected {months[selectedMonth]} {selectedDate},{" "}
        {new Date().getFullYear()} {selectedTime}
      </p>
      <div className="date-selector">
        <button
          className="arrow-btn"
          onClick={handlePrevious}
          disabled={currentOffset === 0}
        >
          <img src={ArrowIconLeft} alt="Previous" />
        </button>
        <div className="dates">
          {dates.map((date, index) => (
            <div
              key={date}
              className={`date ${selectedDate === date ? "active" : ""}`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="day">{days[index]}</div>
              {date}
            </div>
          ))}
        </div>
        <button className="arrow-btn" onClick={handleNext}>
          <img src={ArrowIconRight} alt="Next" />
        </button>
      </div>
      <div className="time-selector">
        {loading ? (
          <p>Loading available times...</p>
        ) : (
          availableTimes.map((slot) => (
            <label
              key={slot.label}
              className={`time ${selectedTime === slot.label ? "active" : ""}`}
            >
              <input
                type="radio"
                name="time"
                value={slot.label}
                checked={selectedTime === slot.label}
                onChange={() => handleTimeSelect(slot.label)}
              />
              {slot.label}
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
