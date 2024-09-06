import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AddressForm = ({
  addressData,
  setAddressData,
  handleSaveAddress,
  onCancel,
}) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!addressData.name.trim()) newErrors.name = "Name is required";
    if (!addressData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    if (!addressData.address.trim()) newErrors.address = "Address is required";
    if (!addressData.city.trim()) newErrors.city = "City is required";
    if (!addressData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!addressData.state.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      handleSaveAddress(addressData);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  return (
    <div className="address-form">
      <div className="address-radio-group">
        <p>Contact:</p>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="self"
            checked={addressData.bookingType === "self"}
            onChange={handleChange}
          />
          <h4>My Self</h4>
        </label>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="others"
            checked={addressData.bookingType === "others"}
            onChange={handleChange}
          />
          <h4>Booking for Others</h4>
        </label>
      </div>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder={`Name (${addressData.name || "Mr/Mrs"})`}
          value={addressData.name}
          onChange={handleChange}
          title={errors.name}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={addressData.mobileNumber}
          onChange={handleChange}
          title={errors.mobileNumber}
          className={errors.mobileNumber ? "input-error" : ""}
        />
        {errors.mobileNumber && (
          <span className="error-message">{errors.mobileNumber}</span>
        )}
      </div>
      <div className="form-row">
        <input
          type="text"
          name="address"
          className={`full-width ${errors.address ? "input-error" : ""}`}
          placeholder="Address (House#, Street)"
          value={addressData.address}
          onChange={handleChange}
          title={errors.address}
        />
        {errors.address && (
          <span className="error-message">{errors.address}</span>
        )}
      </div>
      <div className="form-row">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={addressData.city}
          onChange={handleChange}
          title={errors.city}
          className={errors.city ? "input-error" : ""}
        />
        {errors.city && <span className="error-message">{errors.city}</span>}
        <input
          type="text"
          name="landmark"
          placeholder="Landmark"
          value={addressData.landmark}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={addressData.pincode}
          onChange={handleChange}
          title={errors.pincode}
          className={errors.pincode ? "input-error" : ""}
        />
        {errors.pincode && (
          <span className="error-message">{errors.pincode}</span>
        )}
        <input
          type="text"
          name="state"
          placeholder="State"
          value={addressData.state}
          onChange={handleChange}
          title={errors.state}
          className={errors.state ? "input-error" : ""}
        />
        {errors.state && <span className="error-message">{errors.state}</span>}
      </div>
      <div className="address-button-group">
        <button className="save-address-btn" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} /> <span>SAVE ADDRESS</span>
        </button>
        <button className="cancel-address-btn" onClick={onCancel}>
          <FontAwesomeIcon icon={faTimes} /> <span>CANCEL</span>
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
