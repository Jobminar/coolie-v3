import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addresses.css";
import rightarrow from "../../../assets/images/right-arrow.svg";
import Userprofileaddressform from "./userprofileaddressform";

const Addresses = () => {
  const navigate = useNavigate();
  const [userId, setStoredUserId] = useState(null);
  const [addressData, setAddressesData] = useState([]);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);

  const handleAddAddressClick = () => {
    navigate("/cart");
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setStoredUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchAddresses = async (uid) => {
        try {
          const response = await fetch(
            `https://api-tasktigers.azurewebsites.net/v1.0/users/user-address/${uid}`,
          );
          if (response.ok) {
            const data = await response.json();
            setAddressesData(data);
          } else {
            console.error(
              "Failed to fetch addresses:",
              response.status,
              response.statusText,
            );
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };

      fetchAddresses(userId);
    }
  }, [userId]);

  return (
    <div>
      <div
        className="add-address"
        onClick={handleAddAddressClick}
        style={{ cursor: "pointer" }}
      >
        + Add Address
        <img src={rightarrow} alt="right arrow" />
      </div>
      <div
        className="addresses-post"
        style={{ display: isAddressFormVisible ? "block" : "none" }}
      >
        <Userprofileaddressform />
      </div>
      <h2 className="add-head">Saved Addresses</h2>

      {addressData.length > 0 ? (
        addressData.map((address) => (
          <div key={address._id} className="addresses-sub-con">
            <h1>
              {address.address}
              <span>{address.landmark}</span>
              <span>{address.city}</span>
              <br />
              <span>{address.pincode}</span>
            </h1>
          </div>
        ))
      ) : (
        <p>No addresses found.</p>
      )}
    </div>
  );
};

export default Addresses;
