import React, { useState } from "react";
import "./user-profile.css";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Userprofile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    displayName: "",
    image: null,
    gender: "",
    dateOfBirth: "",
    city: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0], // Get the selected file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("displayName", formData.displayName);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("city", formData.city);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/v1.0/users/userAuth/66c5e36f6e882182dda05115",
        {
          method: "PUT",
          body: formDataToSend, // Send the FormData object
        }
      );

      if (response.ok) {
        // Handle successful response
        console.log("Profile updated successfully");
        navigate("/some-page"); // Navigate to another page if necessary
      } else {
        // Handle error
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Display Name:</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your display name"
          />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleChange} // No need for value here
            accept="image/*" // Restrict file type to images
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </>
  );
};

export default Userprofile;
