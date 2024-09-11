import React from "react";
import "./BookingDetails.css";

const BookingDetails = ({ booking }) => {
  console.log(booking,'booking details in bookings')
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/(\d{4})/, "2024"); // Replace the year with 2024
  };

  // Provide default values if location or address is not available
  const locationAddress =
    booking.location?.address ||
    "Road no-2,Jal Vayu vihar, Addagutta, Hyderabad";
  const jobStartTime = booking.items[0]?.selectedTime || "10:00 PM";
  const jobStartDate = formatDate(
    booking.items[0]?.selectedDate || "2024-08-12",
  );
  const jobEndTime = booking.items[0]?.endTime || "11:00 PM";
  const jobEndDate = formatDate(booking.items[0]?.endDate || "2024-08-12");

  return (
    // <div className="booking-details-container">
    //   <div className="booking-details-header">
    //     <h1>{booking.username || "Username"}</h1>
    //     <p>
    //       {jobStartDate} {jobStartTime}
    //     </p>
    //     <button className="help-button">HELP</button>
    //   </div>

    //   <div className="booking-details-body">
    //     <div className="customer-details">
    //       <h2>Customer Details</h2>
    //       <div className="location-box">
    //         <p>
    //           <strong>Location</strong>
    //         </p>
    //         <p>{locationAddress}</p>
    //         <div className="job-details">
    //           <div>
    //             <p>
    //               <strong>Job start</strong>
    //             </p>
    //             <p>
    //               {jobStartTime} {jobStartDate}
    //             </p>
    //           </div>
    //           <div>
    //             <p>
    //               <strong>Job End</strong>
    //             </p>
    //             <p>
    //               {jobEndTime} {jobEndDate}
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="summary">
    //       <h2>Summary</h2>
    //       {booking.items.map((item, index) => (
    //         <div className="summary-item" key={index}>
    //           <p>{item.serviceName || "1BHK cleaning"}</p>
    //           <p>₹ {item.serviceId?.serviceVariants[0]?.price || "999"}</p>
    //         </div>
    //       ))}
    //       <div className="summary-item">
    //         <p>Others</p>
    //         <p>₹ {booking.convenienceFee || "10"}</p>
    //       </div>
    //       <div className="summary-item total">
    //         <p>Total value</p>
    //         <p>₹ {booking.totalAmount || "N/A"}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
        <div className="booking-view-details">
                {/* provider details would be pending due to not yet completed nbackend */}
                <div className="user-bookings-details">
                      <h1>Booking Details</h1>
                      
                </div>
        </div>
    </>
  );
};

export default BookingDetails;
