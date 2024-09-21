import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Use authentication context
import { CartContext, CartProvider } from "../../context/CartContext"; // Use cart context
import { useLocationPrice } from "../../context/LocationPriceContext"; // Use location and price context
import "./header.css"; // Custom CSS
import playstore from "../../assets/images/play-store.svg";
import apple from "../../assets/images/apple.svg";
import logo from "../../assets/images/logo.png";
import help from "../../assets/images/help.png";
import translate from "../../assets/images/translate.png";
import profile from "../../assets/images/profile.png";
import location from "../../assets/images/location-marker.png";
import search from "../../assets/images/search.png";
import LoginComponent from "../LoginComponent";
import ChatbotComponent from "../Chat/ChatbotComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import CitySearchComponent from "./CitySearchComponent"; // City search component
import ServiceSearchComponent from "./ServiceSearchComponent"; // Service search component
import { confirmAlert } from "react-confirm-alert"; // Alert library for confirming actions
import { toast } from "react-hot-toast"; // Toast notifications
import "react-confirm-alert/src/react-confirm-alert.css"; // Confirm alert styles
import { FaBars } from "react-icons/fa"; // Icon for mobile menu
import registerasaprofessional from "../../assets/images/registerprofessional.png";

// Custom hook for typewriter effect in the search bar placeholder
const useTypewriter = (texts, typing, speed = 100, pause = 2000) => {
  const [index, setIndex] = useState(0); // Tracks current text
  const [subIndex, setSubIndex] = useState(0); // Tracks current character in text
  const [deleting, setDeleting] = useState(false); // Toggle for deleting characters

  useEffect(() => {
    if (typing) return; // Stops effect if user is typing manually

    if (subIndex === texts[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause); // Start deleting after full text is written
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length); // Loop through texts
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1)); // Add or remove characters
      },
      deleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, [subIndex, deleting, index, texts, speed, pause, typing]);

  return deleting
    ? texts[index].substring(0, subIndex)
    : texts[index].substring(0, subIndex); // Return the current substring
};

const Header = ({ children }) => {
  const navigate = useNavigate(); // Initialize navigation
  const {
    isAuthenticated,
    userCity,
    fetchCityName,
    updateUserLocation,
    logout,
  } = useAuth(); // Use authentication context

  const { fetchGeocodeData } = useLocationPrice(); // Use location and price context to get geocode data
  const previousCityRef = useRef(
    sessionStorage.getItem("selectedCity") || userCity || "",
  );
  const { totalItems } = useContext(CartContext); // Cart context to get number of items in cart
  const [isLoginVisible, setLoginVisible] = useState(false); // Control login modal visibility
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // Control chatbot visibility
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false); // Toggle profile menu
  const selectedCityRef = useRef(
    sessionStorage.getItem("selectedCity") || userCity || "",
  );
  const [locationQuery, setLocationQuery] = useState(selectedCityRef.current); // Current city or selected city
  const [selectedCity, setSelectedCity] = useState(selectedCityRef.current); // State for selected city
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Dropdown for city search
  const [serviceQuery, setServiceQuery] = useState(""); // Service search query
  const [isTyping, setIsTyping] = useState(false); // Detect typing in service search
  const [isServiceFocused, setIsServiceFocused] = useState(false); // Focus state for service input
  const [cities, setCities] = useState([]); // City search results
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle mobile menu
  const { clearCart } = useContext(CartContext);
  const timeoutRef = useRef(null); // Ref to control search input debounce

  useEffect(() => {
    // Update location input when userCity changes
    if (userCity) {
      selectedCityRef.current = userCity;
      setLocationQuery(userCity);
      setSelectedCity(userCity);
    }
  }, [userCity]);

  useEffect(() => {
    // Save selected city to session storage when it changes
    sessionStorage.setItem("selectedCity", selectedCityRef.current);
  }, [selectedCity]);

  // Placeholder texts for typewriter effect in service search
  const placeholders = [" Room cleaning", " Laundry", " Gardening"];
  const placeholder = useTypewriter(placeholders, isTyping); // Use typewriter effect for dynamic placeholder

  const handleProfileClick = () => {
    // Toggle profile menu or show login modal if not authenticated
    if (!isAuthenticated) {
      setLoginVisible(true);
    } else {
      setProfileMenuVisible((prev) => !prev);
      setIsMenuOpen((prev) => !prev);

      // Auto-close after 1 minute
      if (!isProfileMenuVisible) {
        toast.success("You can access your profile now!"); // Show success toast
        setTimeout(() => {
          setProfileMenuVisible(false);
        }, 60000);
      }

      if (!isMenuOpen) {
        setTimeout(() => {
          setIsMenuOpen(false);
        }, 60000);
      }
    }
  };

  const closeModal = () => {
    setLoginVisible(false); // Close login modal
  };

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev); // Toggle chatbot visibility
  };

  const handleBookServiceClick = () => {
    navigate("/services"); // Navigate to services page
  };

  const handleCartClick = () => {
    navigate("/cart"); // Navigate to cart page
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to home page
  };

  const handleMyAccountClick = () => {
    navigate("/userprofile"); // Navigate to user profile
    setProfileMenuVisible(false); // Close profile menu
  };

  const handleMyAddressesClick = () => {
    navigate("/addresses"); // Navigate to addresses page
    setProfileMenuVisible(false); // Close profile menu
  };

  const handleMyBookingsClick = () => {
    navigate("/bookings"); // Navigate to bookings page
    setProfileMenuVisible(false); // Close profile menu
  };

  const handleLogoutClick = () => {
    logout(); // Logout
    setProfileMenuVisible(false); // Close profile menu
  };

  const handleCitySelect = (city) => {
    // Handle city selection and update location
    confirmAlert({
      title: "Confirm Location Change",
      message: "Are you sure you want to change your location?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            // Store the previous city before updating
            previousCityRef.current =
              sessionStorage.getItem("selectedCity") || "";

            // Update the selected city
            selectedCityRef.current = city.name;
            setSelectedCity(city.name);
            setLocationQuery(city.name);
            sessionStorage.setItem("selectedCity", city.name); // Store selected city in sessionStorage

            // Compare previous city with the new selected city
            if (previousCityRef.current !== city.name) {
              console.log(
                `Previous city: ${previousCityRef.current}, New city: ${city.name}`,
              );
              clearCart(); // Call clearCart if cities are different
            }

            setIsDropdownVisible(false);
            updateUserLocation(city.coordinates[1], city.coordinates[0]); // Update location using coordinates
            fetchGeocodeData(city.coordinates[1], city.coordinates[0]); // Fetch geocode data for new location
          },
        },
        {
          label: "No",
          onClick: () => setIsDropdownVisible(false),
        },
      ],
      closeOnClickOutside: false,
    });
  };

  const handleLocationInputFocus = () => {
    setLocationQuery(""); // Clear input when focused
    setIsDropdownVisible(false);
  };

  const handleLocationInputBlur = () => {
    // Restore location query if input is left empty
    timeoutRef.current = setTimeout(() => {
      if (!locationQuery) {
        setLocationQuery(userCity || "");
      }
    }, 2000);
  };

  const handleInputChange = (e) => {
    setLocationQuery(e.target.value); // Update location input value
    if (e.target.value.length > 2) {
      setIsDropdownVisible(true); // Show dropdown when query is 3+ characters
    } else {
      setIsDropdownVisible(false); // Hide dropdown otherwise
    }
  };

  const handleLocationIconClick = () => {
    // Use current location for city input
    confirmAlert({
      title: "Use Current Location",
      message: "Do you want to use your current location?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  fetchCityName(latitude, longitude).then((cityName) => {
                    selectedCityRef.current = cityName;
                    setSelectedCity(cityName);
                    setLocationQuery(cityName);
                    updateUserLocation(latitude, longitude); // Update location in context
                    fetchGeocodeData(latitude, longitude); // Fetch geocode data for new location
                    sessionStorage.setItem("selectedCity", cityName);
                  });
                },
                (error) => {
                  console.error("Error getting location:", error);
                  if (error.code === 1) {
                    alert(
                      "Location access is denied. Please allow location access in your browser settings.",
                    );
                  } else {
                    alert(
                      "An error occurred while fetching your location. Please try again.",
                    );
                  }
                },
              );
            } else {
              alert("Geolocation is not supported by this browser.");
            }
          },
        },
        { label: "No", onClick: () => { } },
      ],
      closeOnClickOutside: false,
    });
  };

  const handleServiceInputChange = (e) => {
    setServiceQuery(e.target.value); // Update service search query
    setIsTyping(e.target.value.length > 0); // Toggle typing state
  };

  const handleServiceSelect = (serviceName) => {
    setServiceQuery(serviceName); // Set selected service
    setIsTyping(false); // Stop typing state
    navigate("/services"); // Navigate to services page
  };

  return (
    <CartProvider showLogin={setLoginVisible}>
      <div className="main-h">
        {/* Top header with icons */}
        <div className="f-h">
          <div className="f-h-icons">
            <img src={apple} alt="apple-icon" />
            <img src={playstore} alt="play-store-icon" />
            <p>Download Mobile App</p>
          </div>
          <div className="r-a-p-main" onClick={() => {navigate('/registerap') }}>
            <img className="r-a-p-image" src={registerasaprofessional} />
            <p className="r-a-p">REGISTER AS A PROFESSIONAL</p>
          </div>

          <div className="f-h-last-icons">
            <img src={help} alt="help-icon" onClick={toggleChatbot} />
            <img src={translate} alt="translate-icon" />
            <div className="cart-icon-container" onClick={handleCartClick}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ fontSize: "1.4rem" }}
              />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </div>
            <div>
              <img
                src={profile}
                alt="profile-icon"
                onClick={handleProfileClick}
              />
              {isProfileMenuVisible && (
                <div className="profileMenu">
                  <div className="profile-list" onClick={handleMyAccountClick}>
                    Account
                  </div>
                  <div
                    className="profile-list"
                    onClick={handleMyAddressesClick}
                  >
                    My Addresses
                  </div>
                  <div className="profile-list" onClick={handleMyBookingsClick}>
                    My Bookings
                  </div>
                  <div className="profile-list" onClick={navigate('/packages')}>
                    My Packages
                  </div>
                  <div className="profile-list" onClick={handleLogoutClick}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="logout-icon"
                    />
                    Log Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main header with logo and search bars */}
        <div className="s-h">
          <div className="s-h-logo">
            <img src={logo} alt="logo" onClick={handleLogoClick} />
          </div>
          <div className="s-h-s">
            <div className="location">
              <img
                src={location}
                alt="location-icon"
                onClick={handleLocationIconClick}
              />
              <div className="location-input-wrapper">
                <input
                  className="location-input"
                  value={locationQuery}
                  onChange={handleInputChange}
                  onFocus={handleLocationInputFocus}
                  onBlur={handleLocationInputBlur}
                />
                {locationQuery && isDropdownVisible && (
                  <div className="city-search-wrapper">
                    <CitySearchComponent
                      query={locationQuery}
                      onSelect={handleCitySelect}
                      onClose={() => setIsDropdownVisible(false)}
                      cities={cities}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="search-header">
              <img src={search} alt="search-icon" className="search-icon" />
              <div className="service-search-container">
                <input
                  placeholder={`search for a service ex:${placeholder}`}
                  value={serviceQuery}
                  onChange={handleServiceInputChange}
                  onFocus={() => setIsServiceFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsServiceFocused(false), 200)
                  }
                />
                {isServiceFocused && (
                  <div className="service-search-results">
                    <ServiceSearchComponent
                      searchQuery={serviceQuery}
                      onSelect={handleServiceSelect}
                    />
                  </div>
                )}
              </div>
            </div>
            <button className="books-button" onClick={handleBookServiceClick}>
              BOOK SERVICE
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="mobile-container">
        <div className="topnav">
          <img
            src={logo}
            alt="logo"
            className="main-logo"
            onClick={() => navigate("/")}
          />
          <a
            href="javascript:void(0);"
            className="icon"
            onClick={handleProfileClick}
          >
            <FaBars />
          </a>
        </div>

        {isProfileMenuVisible && (
          <div id="myLinks" className={isMenuOpen ? "show" : ""}>
            <a
              onClick={() => {
                navigate("/userprofile");
                setIsMenuOpen(false);
                setProfileMenuVisible(false);
              }}
            >
              My account
            </a>
            <a
              onClick={() => {
                handleMyBookingsClick();
                setIsMenuOpen(false);
                setProfileMenuVisible(false);
              }}
            >
              My bookings
            </a>
            <a
              onClick={() => {
                navigate('/packages')
                setIsMenuOpen(false);
                setProfileMenuVisible(false);
              }}
            >
              My addresses
            </a>
            <a
              onClick={() => {
                handleMyAddressesClick();
                setIsMenuOpen(false);
                setProfileMenuVisible(false);
              }}
            >
              My packages
            </a>
            <a
              onClick={() => {
                handleLogoutClick();
                setIsMenuOpen(false);
                setProfileMenuVisible(false);
              }}
            >
              Logout
            </a>
          </div>
        )}
      </div>

      {isLoginVisible && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <LoginComponent
              onLoginSuccess={() => {
                closeModal();
                setProfileMenuVisible(true);
              }}
            />
          </div>
        </div>
      )}
      {isChatbotVisible && <ChatbotComponent />}
      {children}
    </CartProvider>
  );
};

export default Header;
