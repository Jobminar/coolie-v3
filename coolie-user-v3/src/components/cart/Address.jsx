import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowLeft,
  faSave,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./Address.css";
import { useAuth } from "../../context/AuthContext"; // `useAuth` context includes `clearCart`
import {
  saveAddress,
  getSavedAddresses,
  deleteAddress,
} from "./api/address-api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "./AddressForm";
import LocationModal from "./LocationModal";
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";
import { confirmAlert } from "react-confirm-alert"; // Import confirm alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import alert styles
import DeleteIcon from "../../assets/images/Delete.png"; // Import the delete icon

const Address = ({ onNext }) => {
  const { phone } = useAuth(); // Removed clearCart from here
  const { totalItems, totalPrice, handleLocationUpdate } =
    useContext(CartContext); // Added handleLocationUpdate from CartContext
  const { updateSelectedAddressId } = useContext(OrdersContext);
  const [cookies] = useCookies(["location"]);
  const initialLocation = cookies.location || {};

  const userId = sessionStorage.getItem("userId") || ""; // Use sessionStorage for userId
  console.log("phone number", phone);
  const [addressData, setAddressData] = useState({
    bookingType: "self",
    name: "",
    mobileNumber: phone || sessionStorage.getItem("phone") || "",
    address: "",
    city: initialLocation.city || "Hyderabad",
    pincode: initialLocation.pincode || "500072",
    landmark: initialLocation.landmark || "Medchal-Malkajgiri",
    state: initialLocation.state || "Telangana",
    latitude: Number(initialLocation.latitude) || 0,
    longitude: Number(initialLocation.longitude) || 0,
    userId: userId,
  });

  const [showForm, setShowForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [pendingAddress, setPendingAddress] = useState(null); // For storing selected address
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [filterBookingType, setFilterBookingType] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Fetch saved addresses for the user
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (userId) {
        try {
          const addresses = await getSavedAddresses(userId);
          setSavedAddresses(addresses || []);
          if (addresses.length === 1) {
            setSelectedAddress(addresses[0]); // Automatically select the first address if only one
            updateSelectedAddressId(addresses[0]._id);
          }
        } catch (error) {
          console.error("Error fetching saved addresses:", error);
          toast.error("Error fetching saved addresses.");
        }
      }
    };
    fetchSavedAddresses();
  }, [userId, updateSelectedAddressId]);

  // Handle radio button change for selecting an address
  const handleRadioChange = (address) => {
    if (savedAddresses.length > 0) {
      setPendingAddress(address); // Store the selected address temporarily

      // Trigger the confirmation popup using `react-confirm-alert`
      confirmAlert({
        title: "Confirm Address",
        message: `Do you want to use the selected address for this booking?`,
        buttons: [
          {
            label: "Yes",
            onClick: () => confirmClearCart(),
          },
          {
            label: "No",
            onClick: () => setPendingAddress(null), // Clear pending address
          },
        ],
      });
    }
  };

  // Confirm clearing the cart and updating the location
  const confirmClearCart = () => {
    if (!pendingAddress) return;

    // Update address data and userId
    setSelectedAddress(pendingAddress);
    setAddressData({ ...pendingAddress, userId });

    // Update the selected address ID in the orders context
    updateSelectedAddressId(pendingAddress._id);

    // Update the user's location and trigger cart clearing via CartContext
    handleLocationUpdate(pendingAddress.latitude, pendingAddress.longitude);
  };

  // Handle save address
  const handleSaveAddress = async (addressData) => {
    try {
      const requestBody = {
        ...addressData,
        username: addressData.name,
        latitude: Number(addressData.latitude),
        longitude: Number(addressData.longitude),
        userId: userId,
      };
      delete requestBody.name; // Remove name since we're using 'username'

      await saveAddress(requestBody);
      const addresses = await getSavedAddresses(userId);
      setSavedAddresses(addresses);
      setShowForm(false);
      setShowSavedAddresses(true);
      setIsAddingNewAddress(false);
      toast.success("Address saved successfully.");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Error saving address.");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      return;
    }
    onNext("schedule");
  };

  // Handle location selection from LocationModal
  const handleLocationSelect = (location) => {
    const parsedAddress = parseAddress(location.address);

    // Update address data and set latitude/longitude
    setAddressData((prevData) => ({
      ...prevData,
      address: parsedAddress.address,
      city: parsedAddress.city,
      pincode: parsedAddress.pincode,
      landmark: parsedAddress.landmark,
      state: parsedAddress.state,
      latitude: location.latitude,
      longitude: location.longitude,
      userId: userId,
    }));
    setShowLocationModal(false);
    setShowForm(true);
    setShowSavedAddresses(false);
  };

  // Parse address string into components
  const parseAddress = (fullAddress) => {
    const pincodeRegex = /\b\d{6}\b/; // Regex to match 6-digit pincode
    const pincodeMatch = fullAddress.match(pincodeRegex); // Find the pincode in the string
    const pincode = pincodeMatch ? pincodeMatch[0] : "";

    // Remove the pincode from the full address for further processing
    let addressWithoutPincode = fullAddress.replace(pincode, "").trim();

    // Split the address into parts based on commas
    const parts = addressWithoutPincode.split(",").map((part) => part.trim());

    const address = parts.slice(0, 2).join(", "); // First two parts for the address
    const city = parts.length > 2 ? parts[parts.length - 3] : ""; // Third last part is city
    const landmark = parts.length > 3 ? parts[parts.length - 4] : ""; // Fourth last part is landmark
    const state = parts.length > 1 ? parts[parts.length - 2] : ""; // Second last part is state

    return {
      address,
      city,
      pincode,
      landmark,
      state,
    };
  };

  // Toggle between adding new address and viewing saved addresses
  const handleAddNewAddressClick = () => {
    if (isAddingNewAddress) {
      setShowLocationModal(false);
      setShowForm(false);
      setShowSavedAddresses(true);
      setIsAddingNewAddress(false);
    } else {
      setShowLocationModal(true);
      setShowForm(false);
      setShowSavedAddresses(false);
      setIsAddingNewAddress(true);
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      const addresses = await getSavedAddresses(userId);
      setSavedAddresses(addresses);
      toast.success("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Error deleting address.");
    }
  };

  const filteredAddresses = filterBookingType
    ? savedAddresses.filter(
        (address) => address.bookingType === filterBookingType,
      )
    : savedAddresses;

  return (
    <div className="address-container">
      <ToastContainer /> {/* Toast notifications */}
      <div className="add-new-address" onClick={handleAddNewAddressClick}>
        <FontAwesomeIcon icon={isAddingNewAddress ? faArrowLeft : faAdd} />
        <span>
          {isAddingNewAddress ? "Saved Addresses" : "Add New Address"}
        </span>
      </div>
      {showSavedAddresses && (
        <div className="toggle-saved-addresses-container">
          <div className="saved-addresses-title">
            <FontAwesomeIcon icon={faSave} />
            <span>Saved Addresses</span>
          </div>
          <div className="booking-type-filter">
            <span className="bookingType">Booking Type</span>
            <div className="select-wrapper">
              <select
                id="filterBookingType"
                value={filterBookingType}
                onChange={(e) => setFilterBookingType(e.target.value)}
                className="filter-container"
              >
                <option value="">All</option>
                <option value="self">Self</option>
                <option value="others">Others</option>
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
            </div>
          </div>
        </div>
      )}
      {showSavedAddresses && (
        <div className="saved-addresses-container">
          {filteredAddresses.length > 0 ? (
            filteredAddresses.map((address, index) => (
              <div key={index} className="saved-address">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress?._id === address._id}
                  onChange={() => handleRadioChange(address)}
                  className="address-radio"
                />
                <div
                  className="delete-address-icon"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  <img src={DeleteIcon} alt="Delete" />
                </div>
                <div className="saved-address-content">
                  <p>
                    <strong>Name:</strong> {address.username} <br />
                    <strong>Mobile:</strong> {address.mobileNumber} <br />
                    <strong>Booking Type:</strong> {address.bookingType} <br />
                    <strong>Address:</strong> {address.address}, {address.city},{" "}
                    {address.pincode}, {address.landmark}, {address.state}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses available</p>
          )}
        </div>
      )}
      {showForm && (
        <AddressForm
          addressData={addressData}
          setAddressData={setAddressData}
          handleSaveAddress={handleSaveAddress}
          onCancel={() => {
            setShowForm(false);
            setShowSavedAddresses(true);
            setIsAddingNewAddress(false);
          }}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
        />
      )}
      <div
        className="address-totals"
        style={{ display: showLocationModal ? "none" : "flex" }}
      >
        <div className="address-totals-info">
          <h5>{totalItems} Items</h5>
          <p>₹{totalPrice.toFixed(2)}</p>
        </div>
        <div className="address-totals-button">
          <button className="go-to-address-btn" onClick={handleSubmit}>
            SCHEDULE YOUR VISIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
