import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CartContext, CartProvider } from "../../context/CartContext";
import "./header.css";
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
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CitySearchComponent from "./CitySearchComponent";
import ServiceSearchComponent from "./ServiceSearchComponent";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-hot-toast";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaBars } from 'react-icons/fa';
import registerasaprofessional from '../../assets/images/registerprofessional.png'

// Custom hook for typewriter effect
const useTypewriter = (texts, typing, speed = 100, pause = 2000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Stop typewriter effect if the user is typing
    if (typing) {
      return;
    }

    // Start deleting after full text is written
    if (subIndex === texts[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }

    // Move to next text after deleting
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    // Typing or deleting characters based on state
    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, texts, speed, pause, typing]);

  return deleting
    ? texts[index].substring(0, subIndex)
    : texts[index].substring(0, subIndex);
};

const Header = ({ children }) => {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const {
    isAuthenticated,
    userCity,
    fetchCityName,
    updateUserLocation,
    logout,
  } = useAuth();
  const { totalItems } = useContext(CartContext);
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const selectedCityRef = useRef(
    sessionStorage.getItem("selectedCity") || userCity || "",
  );
  const [locationQuery, setLocationQuery] = useState(selectedCityRef.current);
  const [selectedCity, setSelectedCity] = useState(selectedCityRef.current);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isServiceFocused, setIsServiceFocused] = useState(false);
  const [cities, setCities] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    // Update location input field when userCity changes
    if (userCity) {
      selectedCityRef.current = userCity;
      setLocationQuery(userCity);
      setSelectedCity(userCity);
    }
  }, [userCity]);

  useEffect(() => {
    // Save selected city in session storage
    sessionStorage.setItem("selectedCity", selectedCityRef.current);
  }, [selectedCity]);

  // Placeholder texts for typewriter effect
  const placeholders = [
    " Room cleaning, kitchen cleaning",
    " Laundry, dishwashing",
    " Gardening, pet sitting",
  ];
  const placeholder = useTypewriter(placeholders, isTyping);


  const handleProfileClick = () => {
    // Toggle profile menu visibility
    if (!isAuthenticated) {
      setLoginVisible(true);
    } else {
      setProfileMenuVisible((prev) => !prev);
      setIsMenuOpen((prev) => !prev);
  
      if (!isProfileMenuVisible) {
        toast.success("You can access your profile now!");
  
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
    // Close login modal
    setLoginVisible(false);
  };

  const toggleChatbot = () => {
    // Toggle chatbot visibility
    setIsChatbotVisible((prev) => !prev);
  };

  const handleBookServiceClick = () => {
    // Navigate to services page
    navigate("/services");
  };

  const handleCartClick = () => {
    // Navigate to cart page
    navigate("/cart");
  };

  const handleLogoClick = () => {
    // Navigate to home page
    navigate("/");
  };

  const handlemyaccount=()=>{
    navigate("/userprofile");
    setProfileMenuVisible(false);
  }

  const handleMyAddressesClick = () => {
    // Navigate to addresses page
    navigate("/addresses");
    setProfileMenuVisible(false);
  };

  const handleMyBookingsClick = () => {
    // Navigate to bookings page
    navigate("/bookings");
    setProfileMenuVisible(false);
  };

  const handleLogoutClick = () => {
    // Logout user and close profile menu
    logout();
    setProfileMenuVisible(false);
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
            selectedCityRef.current = city.name;
            setSelectedCity(city.name);
            setLocationQuery(city.name);
            setIsDropdownVisible(false);
            updateUserLocation(city.coordinates[1], city.coordinates[0]);
            sessionStorage.setItem("selectedCity", city.name);
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
    // Clear location input field when focused
    setLocationQuery("");
    setIsDropdownVisible(false);
  };

  const handleLocationInputBlur = () => {
    // Restore location input field after blur if empty
    timeoutRef.current = setTimeout(() => {
      if (!locationQuery) {
        setLocationQuery(userCity || "");
      }
    }, 2000);
  };

  const handleInputChange = (e) => {
    // Handle changes in location input field
    clearTimeout(timeoutRef.current);
    setLocationQuery(e.target.value);
    if (e.target.value.length > 2) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
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
                    updateUserLocation(latitude, longitude);
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
        {
          label: "No",
          onClick: () => {},
        },
      ],
      closeOnClickOutside: false,
    });
  };

  const handleServiceInputChange = (e) => {
    // Handle changes in service input field
    setServiceQuery(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleServiceSelect = (serviceName) => {
    // Update input field with selected service and redirect
    setServiceQuery(serviceName);
    setIsTyping(false);
    navigate("/services");
  };

  // mobile responsive



  return (
    <CartProvider showLogin={setLoginVisible}>
      <div className="main-h">
        <div className="f-h">
          {/* Top header with icons */}
          <div className="f-h-icons">
            <img src={apple} alt="apple-icon" />
            <img src={playstore} alt="play-store-icon" />
            <p>Download Mobile App</p>
          </div>
          <div className="r-a-p-main">
          <img className="r-a-p-image" src={registerasaprofessional}/>
          <p className="r-a-p">REGISTER AS A PROFESSIONAL</p>
          </div>
         
          <div className="f-h-last-icons">
            <img src={help} alt="icon" onClick={toggleChatbot} />
            <img src={translate} alt="icon" />
            <div className="cart-icon-container" onClick={handleCartClick}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ fontSize: "1.4rem" }}
              />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </div>
            <div>
              <img src={profile} alt="icon" onClick={handleProfileClick} />
              {isProfileMenuVisible && (
                <div className="profileMenu">
                  <div className="profile-list" onClick={handlemyaccount}>Account</div>
                  <div
                    className="profile-list"
                    onClick={handleMyAddressesClick}
                  >
                    My Addresses
                  </div>
                  <div className="profile-list" onClick={handleMyBookingsClick}>
                    My Bookings
                  </div>
                  <div
                    className="profile-list"
                    onClick={handleLogoutClick}
                    id="logout-button"
                  >
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
        <div className="s-h">
          {/* Main header with logo and search bars */}
          <div className="s-h-logo">
            <img src={logo} alt="logo" onClick={handleLogoClick} />
          </div>
          <div className="s-h-s">
            <div className="location">
              <img
                src={location}
                alt="location"
                onClick={handleLocationIconClick}
              />
              <div className="location-input-wrapper">
                <input
                  className="location-input"
                  // placeholder="City"
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
              <img src={search} alt="search-logo" className="search-icon" />
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

      {/* mobile header */}

      <div className="mobile-container">
        <div className="topnav">
          <img src={logo} alt="logo" className="main-logo" onClick={()=>{navigate('/')}}/>
          <a href="javascript:void(0);" className="icon" onClick={handleProfileClick}>
            <FaBars />
          </a>
        </div>

        {isProfileMenuVisible && (
          <div id="myLinks" className={isMenuOpen ? 'show' : ''}>
            <a onClick={() => { navigate('/userprofile'); setIsMenuOpen(false); setProfileMenuVisible(false); }}>My account</a>
            <a onClick={() => { handleMyBookingsClick(); setIsMenuOpen(false); setProfileMenuVisible(false); }}>My bookings</a>
            <a onClick={() => { handleMyAddressesClick(); setIsMenuOpen(false); setProfileMenuVisible(false); }}>My addresses</a>
            <a onClick={() => { handleLogoutClick(); setIsMenuOpen(false); setProfileMenuVisible(false); }}>Logout</a>
          </div>
        )}
      </div>

      {/* mobile responsive end */}
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
