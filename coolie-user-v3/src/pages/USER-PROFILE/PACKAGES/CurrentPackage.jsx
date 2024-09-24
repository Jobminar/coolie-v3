import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./CurrentPackage.css"; // Add styles for your current package card

const CurrentPackage = ({ userId }) => {
  console.log("the current userId", userId);
  const [currentPackage, setCurrentPackage] = useState(null); // Store the user's current package
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch the user's current package
  useEffect(() => {
    const fetchUserPackage = async () => {
      if (!userId) return; // Ensure userId is available
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.coolieno1.in/v1.0/users/user-packages/${userId}`,
        );
        const data = await response.json();

        console.log("API response data:", data); // Log API response for debugging

        // Handle case when data is an object or array
        if (response.ok) {
          if (Array.isArray(data) && data.length > 0) {
            console.log("Setting the current package from array:", data[0]);
            setCurrentPackage(data[0]); // If API returns an array, use the first item
          } else if (data && typeof data === "object" && data._id) {
            console.log("Setting the current package from object:", data);
            setCurrentPackage(data); // If API returns a single object, use it
          } else {
            console.log("No valid package data found.");
            setCurrentPackage(null); // No package found
          }
        } else {
          console.error("Error in API response:", data);
          setCurrentPackage(null);
          toast.error("Failed to fetch current package.");
        }
      } catch (err) {
        console.error("Error fetching package:", err);
        toast.error("Failed to fetch current package.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPackage();
  }, [userId]);

  if (loading) {
    return <p>Loading current package...</p>;
  }

  return (
    <div className="current-package-container">
      {currentPackage ? (
        <div className="package-card">
          <h3 className="package-title">Your Current Package</h3>
          <div className="package-content">
            <p>
              <strong>Package Name:</strong> {currentPackage.packageName}
            </p>
            <p>
              <strong>Validity:</strong> {currentPackage.validity}
            </p>
            <p>
              <strong>Price:</strong> ₹{currentPackage.priceRs}
            </p>
            <p>
              <strong>Discount:</strong> {currentPackage.discount}%
            </p>
            <p>
              <strong>Description:</strong> {currentPackage.description}
            </p>
            <p>
              <strong>Expiry Date:</strong>{" "}
              {new Date(currentPackage.expiryDate).toLocaleDateString()}
            </p>
            <p className="package-status">
              <strong>Status:</strong>{" "}
              {new Date(currentPackage.expiryDate) > new Date()
                ? `${Math.ceil(
                    (new Date(currentPackage.expiryDate) - new Date()) /
                      (1000 * 60 * 60 * 24),
                  )} day(s) left`
                : "Expired"}
            </p>
          </div>
        </div>
      ) : (
        <div className="no-package">
          <h3>No active package</h3>
          <p>Purchase a package to enjoy the benefits!</p>
        </div>
      )}
    </div>
  );
};

export default CurrentPackage;
