
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import location from '../../../assets/images/location-marker.png'
import LocationModal from "../../../components/cart/LocationModal";

const Userprofileaddressform = ({ userId }) => {
    // const userid = sessionStorage('userId')
    // console.log(userid, 'user id in addresses form')
    const [isFormVisible, setIsFormVisible] = useState(false);

    const chooseCurrentLocation = () => {
      setIsFormVisible(!isFormVisible);
    };
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    landmark: "",
    errors: {},
  });
  const [isLocationVisible, setIsLocationVisible] = useState(false);

  const handleCurrLocation = () => {
    setIsLocationVisible(!isLocationVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    setFormData((prevState) => ({
      ...prevState,
      errors: newErrors,
    }));
    return Object.keys(newErrors).length === 0;
  };

  const chooseCurrentlocation=()=>{
    
    console.log('toast called')
        
  }
 

  const handleSave = async () => {
    // if (validateFields()) {
    //   try {
    //     const response = await fetch(`https://api.coolieno1.in/v1.0/users/user-address/${userId}`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         name: formData.name,
    //         mobileNumber: formData.mobileNumber,
    //         address: formData.address,
    //         city: formData.city,
    //         pincode: formData.pincode,
    //         state: formData.state,
    //         landmark: formData.landmark,
    //       }),
    //     });

    //     if (response.ok) {
    //       toast.success("Address saved successfully!");
    //       setFormData({
    //         name: "",
    //         mobileNumber: "",
    //         address: "",
    //         city: "",
    //         pincode: "",
    //         state: "",
    //         landmark: "",
    //         errors: {},
    //       });
    //     } else {
    //       toast.error("Failed to save address.");
    //     }
    //   } catch (error) {
    //     toast.error("An error occurred while saving the address.");
    //   }
    // } else {
    //   toast.error("Please fill in all required fields.");
    // }
    console.log(formData)
    
  };


  return (
    <div className="address-form">
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Name (Mr/Mrs)"
          value={formData.name}
          onChange={handleChange}
          title={formData.errors.name}
          className={formData.errors.name ? "input-error" : ""}
        />
        {formData.errors.name && (
          <span className="error-message">{formData.errors.name}</span>
        )}
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          title={formData.errors.mobileNumber}
          className={formData.errors.mobileNumber ? "input-error" : ""}
        />
        {formData.errors.mobileNumber && (
          <span className="error-message">{formData.errors.mobileNumber}</span>
        )}
      </div>
      <input
        type="text"
        name="address"
        className={`full-width ${formData.errors.address ? "input-error" : ""}`}
        placeholder="Address (House#, Street)"
        value={formData.address}
        onChange={handleChange}
        title={formData.errors.address}
      />
      {formData.errors.address && (
        <span className="error-message">{formData.errors.address}</span>
      )}
      <div className="form-row">
        <input
          type="text"
          name="city"
          placeholder="City / Dist"
          value={formData.city}
          onChange={handleChange}
          title={formData.errors.city}
          className={formData.errors.city ? "input-error" : ""}
        />
        {formData.errors.city && (
          <span className="error-message">{formData.errors.city}</span>
        )}
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          title={formData.errors.pincode}
          className={formData.errors.pincode ? "input-error" : ""}
        />
        {formData.errors.pincode && (
          <span className="error-message">{formData.errors.pincode}</span>
        )}
      </div>
      <div className="form-row">
        <input
          type="text"
          name="landmark"
          placeholder="Landmark (Optional)"
          value={formData.landmark}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          title={formData.errors.state}
          className={formData.errors.state ? "input-error" : ""}
        />
        {formData.errors.state && (
          <span className="error-message">{formData.errors.state}</span>
        )}
      </div>
      <img src={location} alt="choose-location" onClick={chooseCurrentLocation} />
      <div className="location-form" style={{ display: isFormVisible ? 'block' : 'none' }}>
        <LocationModal />
      </div>
      <button className="save-address-btn" onClick={handleSave}>
        <FontAwesomeIcon icon={faSave} /> <span>SAVE ADDRESS</span>
      </button>
    </div>
  );
};

export default Userprofileaddressform;
