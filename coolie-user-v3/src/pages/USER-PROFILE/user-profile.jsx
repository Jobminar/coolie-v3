import React, { useState, useEffect } from "react";
import "./user-profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEdit } from "react-icons/fa"; // Import edit icon
import { toast, Toaster } from "react-hot-toast";

const Userprofile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    displayName: "",
    image: "", // This will be the URL of the image or a File object
    gender: "",
    dateOfBirth: "",
    city: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const storredUserId = sessionStorage.getItem("userId");

  useEffect(() => {
    setUserId(storredUserId);
  }, [storredUserId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `{Azure_Base_url}$/v1.0/users/userAuth/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            email: data.email || "",
            name: data.name || "",
            displayName: data.displayName || "",
            gender: data.gender || "",
            dateOfBirth: data.dateOfBirth || "",
            city: data.city || "",
            image: data.image || "", // Assuming this is a URL
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0], // Update with the File object for new image
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission (PUT method for full update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("displayName", formData.displayName);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("city", formData.city);
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `{Azure_Base_url}$/v1.0/users/userAuth/${userId}`,
        {
          method: "PUT",
          body: formDataToSend,
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
        setIsEditing(false); // Exit edit mode after successful update
        toast.success("Profile updated successfully");
        console.log("Profile updated successfully");
      } else {
        toast.error("Error updating profile");
        console.error("Error updating profile");
      }
    } catch (error) {
      toast.error("Error:", error.message);
      console.error("Error:", error);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Toaster />{" "}
      {/* Add the Toaster component to display toast notifications */}
      <center>
        <h2 className="profile-head">User Profile</h2>
      </center>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="profile-image">
          <label htmlFor="file-upload" className="custom-file-upload">
            {formData.image && typeof formData.image === "string" ? (
              <img
                src={formData.image}
                alt="profile preview"
                className="profile-preview"
              />
            ) : formData.image instanceof File ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="profile preview"
                className="profile-preview"
              />
            ) : (
              <div className="placeholder">Upload Image</div>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Email:</label>
            <div className="input-with-icon">
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Name:</label>
            <div className="input-with-icon">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <div className="input-with-icon">
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <div className="input-with-icon">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>City:</label>
            <div className="input-with-icon">
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <button type="submit" disabled={!isEditing}>
            Save Profile
          </button>
          <button
            type="button"
            onClick={toggleEditMode}
            className="editprofile"
          >
            {isEditing ? "Cancel edit" : "Edit profile"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Userprofile;
