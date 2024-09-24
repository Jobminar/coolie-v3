import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./CurrentPackage.css"; // Add styles for your current package card

const CurrentPackage = ({ userId }) => {
  const [currentPackage, setCurrentPackage] = useState(null); // Store the user's current package
  const [loading, setLoading] = useState(false); // Track loading state

  // Function to calculate remaining days until expiry
  const calculateRemainingDays = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - currentDate; // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    return diffDays;
  };

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

        if (response.ok && data.length > 0) {
          setCurrentPackage(data[0]); // Assuming API returns an array of packages, get the first one
        } else {
          setCurrentPackage(null); // No package found
        }
      } catch (err) {
        console.log(err);
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
          <h3>Your Current Package</h3>
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
          <p>
            <strong>Status:</strong>{" "}
            {currentPackage.status === "active" ? (
              <span>
                {calculateRemainingDays(currentPackage.expiryDate) > 0
                  ? `${calculateRemainingDays(
                      currentPackage.expiryDate,
                    )} day(s) left`
                  : "Expired"}
              </span>
            ) : (
              "Inactive"
            )}
          </p>
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
