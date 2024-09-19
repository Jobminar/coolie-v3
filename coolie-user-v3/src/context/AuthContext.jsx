import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Toaster } from "react-hot-toast";
import useUserLocation from "../hooks/useUserLocation";
import CaptchaComponent from "../components/Security/CaptchaComponent";
import { useLocationPrice } from "../context/LocationPriceContext";
import LZString from "lz-string";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const userIdRef = useRef(null); // Using useRef to persist userId
  const [userCity, setUserCity] = useState(
    sessionStorage.getItem("selectedCity") || null,
  );
  const userLocationRef = useRef({ latitude: null, longitude: null });
  const { fetchGeocodeData } = useLocationPrice();
  const {
    location: userLocation,
    error: locationError,
    setLocation: setUserLocation,
  } = useUserLocation();
  // useRef for storing phone and otp
  const phoneRef = useRef(null);
  const otpRef = useRef(null);
  //fetching user location---------------------------------------------------
  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
          import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
        }`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const city = data.features.find((feature) =>
            feature.place_type.includes("place"),
          );
          return city ? city.text : "Unknown location";
        }
      } else {
        console.error("Failed to fetch city name from Mapbox.");
      }
    } catch (error) {
      console.error("Error fetching city name from Mapbox:", error);
    }
    return "Unknown location";
  };

  useEffect(() => {
    if (userLocation && !sessionStorage.getItem("selectedCity")) {
      const { latitude, longitude } = userLocation;
      fetchCityName(latitude, longitude).then((city) => {
        setUserCity(city);
        userLocationRef.current = { latitude, longitude };
        if (latitude && longitude) {
          fetchGeocodeData(latitude, longitude); // Send latitude and longitude to LocationPriceContext
        }
      });
    }
  }, [userLocation, fetchGeocodeData]);
  //update the window reload whern user city updates
  useEffect(() => {
    if (userCity && sessionStorage.getItem("selectedCity") !== userCity) {
      sessionStorage.setItem("selectedCity", userCity);

      // Reload the page when userCity changes
      window.location.reload(); // Trigger a reload when userCity changes
    }
  }, [userCity]);
  useEffect(() => {
    if (userCity) {
      // sessionStorage.setItem("selectedCity", userCity);
    }
  }, [userCity]);
  //----------updating user lat long to location pricing
  const updateUserLocation = async (latitude, longitude) => {
    userLocationRef.current = { latitude, longitude };
    sessionStorage.setItem("latitude", latitude);
    sessionStorage.setItem("longitude", longitude);

    const city = await fetchCityName(latitude, longitude);
    setUserCity(city);
    console.log(city, "cityname");
    if (latitude && longitude) {
      fetchGeocodeData(latitude, longitude); // Call fetchGeocodeData with the coordinates
    }
  };
  //getting user profile data--------------------------------------------------------------------
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/userAuth/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        const errorData = await response.json();
        console.error(
          "Error fetching user info:",
          response.status,
          response.statusText,
          errorData,
        );
        toast.error("Failed to fetch user info.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Error fetching user info.");
    }
  };

  useEffect(() => {
    const storedJwtToken = sessionStorage.getItem("jwtToken");
    const storedUserId = sessionStorage.getItem("userId");
    const storedExpirationTime = sessionStorage.getItem("expirationTime");
    userIdRef.current = storedUserId; // Store userId in ref
    if (storedJwtToken && storedUserId && storedExpirationTime) {
      const currentTime = Date.now();

      if (currentTime < storedExpirationTime) {
        fetchUserInfo(storedUserId).then((userInfo) => {
          setUser(userInfo);
          setIsAuthenticated(true);
          setSessionTimeout(storedExpirationTime - currentTime);
        });
      } else {
        logout();
      }
    }
  }, []);

  // Function to store phone in the ref when OTP is sent
  // Assume this is part of your AuthContext
  const sendOtp = async ({ phone }) => {
    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/userAuth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        console.log("OTP sent successfully:", data.otp);

        // Compress and store the OTP in sessionStorage
        const compressedOtp = LZString.compress(String(data.otp));
        sessionStorage.setItem("compressedOtp", compressedOtp);
      } else {
        console.error("Error sending OTP:", data.message);
      }
    } catch (error) {
      console.error("Error in sendOtp:", error);
    }
  };

  // Function to store otp in the ref when OTP is verified
  const verifyOtp = async (otp) => {
    otpRef.current = otp; // Store OTP in useRef
    console.log("OTP stored:", otpRef.current);
  };

  const login = async ({
    phone,
    otp,
    email,
    name,
    displayName,
    photoURL,
    providerId,
  }) => {
    const userInfo = googleUser || {};
    const loginData = {
      phone,
      otp: isNaN(otp) ? otp : Number(otp),
      email: email || userInfo.email,
      name: name || userInfo.name,
      displayName: displayName || userInfo.displayName,
      photoURL: photoURL || userInfo.photoURL,
      providerId: providerId || userInfo.providerId,
    };

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/userAuth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("the backend data after login", data);
        console.log("line 151 Login successful:", data);
        const expirationTime = Date.now() + 60 * 60 * 1000;
        sessionStorage.setItem("jwtToken", data.token);
        sessionStorage.setItem("userId", data.user._id);
        sessionStorage.setItem("expirationTime", expirationTime);
        // sessionStorage.setItem("phone", data.user.phone);
        setSessionTimeout(60 * 60 * 1000);
        setUser(data.user);
        setIsAuthenticated(true);
        userIdRef.current = data.user._id; // Store userId in ref
        toast.success("Login successful.");

        console.log("User location:", userLocation);

        return true;
      } else {
        const errorData = await response.json();
        console.error(
          "Login failed",
          response.status,
          response.statusText,
          errorData,
        );
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error during login.");
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("expirationTime");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("selectedCity");
    setUser(null);
    setIsAuthenticated(false);
    if (timeoutId) clearTimeout(timeoutId);
    toast.success("Logged out successfully.");
  };

  const setSessionTimeout = (expiresIn) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      if (!captchaVerified) {
        showCaptcha();
      } else {
        logout();
      }
    }, expiresIn - 20000);
    setTimeoutId(newTimeoutId);
  };

  const showCaptcha = () => {
    confirmAlert({
      title: "Verify You're Human",
      message: (
        <CaptchaComponent
          onVerify={(isVerified) => {
            setCaptchaVerified(isVerified);
            if (isVerified) {
              const newExpirationTime = Date.now() + 60 * 60 * 1000;
              sessionStorage.setItem("expirationTime", newExpirationTime);
              setSessionTimeout(60 * 60 * 1000);
              toast.success("CAPTCHA verified. Session extended.");
            }
          }}
        />
      ),
      buttons: [
        {
          label: "Close",
          onClick: () => logout(),
        },
      ],
      closeOnClickOutside: false,
    });
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userInfo = {
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerData[0].providerId,
      };

      setGoogleUser(userInfo);
      toast.success("Google Sign-In successful.");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.error("Google Sign-In error.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: userIdRef.current,
        userLocation,
        userCity,
        fetchCityName,
        setUserLocation,
        updateUserLocation,
        login,
        isAuthenticated,
        sendOtp,
        loginWithGoogle,
        googleUser,
        logout,
        fetchUserInfo,
        verifyOtp,
        phoneRef,
        otpRef,
      }}
    >
      {children}
      {locationError && <p>{locationError}</p>}
      <Toaster limit={1} /> {/* This line limits to one toast */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
