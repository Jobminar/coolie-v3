import React, { useContext } from "react";
import "./ScheduleFooter.css"; // Use a different CSS file for ScheduleFooter
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ScheduleFooter = ({ onNext }) => {
  const { totalItems, totalPrice } = useContext(CartContext);
  const { orderDetails, selectedAddressId, categoryIds, subCategoryIds } =
    useContext(OrdersContext);

  const handleProceedToCheckout = () => {
    const defaultDate = new Date().getDate().toString().padStart(2, "0");
    const defaultTime = "9AM - 10AM";
    const defaultMonth = new Date().getMonth();

    const items = orderDetails.flatMap((cart) =>
      cart.items.map((item) => ({
        ...item,
        scheduledDate: `${item.selectedDate || defaultDate}-${
          item.selectedMonth || defaultMonth
        }-${item.selectedTime || defaultTime}`,
        selectedDate: item.selectedDate || defaultDate,
        selectedTime: item.selectedTime || defaultTime,
        selectedMonth: item.selectedMonth || defaultMonth,
      })),
    );

    const orderData = {
      addressId: selectedAddressId,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      items: items,
    };

    console.log("Order Data on Proceed to Checkout:", orderData);

    confirmAlert({
      title: "Confirm to proceed",
      message: `Your selected items:\n${orderDetails
        .map((cart) =>
          cart.items
            .map(
              (item) =>
                `${item.serviceId.name}: ${item.selectedDate || defaultDate}-${
                  item.selectedMonth || defaultMonth
                }-${item.selectedTime || defaultTime}\n`,
            )
            .join(""),
        )
        .join("")}`,
      buttons: [
        {
          label: "Confirm",
          onClick: () => onNext("checkout"),
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="schedule-total">
      <div className="schedule-total-info">
        <h5>{totalItems} Items</h5>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="schedule-total-button">
        <button
          className="proceed-to-checkout-btn"
          onClick={handleProceedToCheckout}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default ScheduleFooter;
