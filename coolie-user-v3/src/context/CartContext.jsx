import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { useLocationPrice } from "./LocationPriceContext";
// Creating the Cart Context
export const CartContext = createContext();

// Export a custom hook to use the Cart context
export const useCart = () => useContext(CartContext);

// CartProvider component that will wrap other components
export const CartProvider = ({ children, cartId, showLogin }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);
  const [cartNotFound, setCartNotFound] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { updateUserLocation } = useAuth();
  const { getStoredPincode } = useLocationPrice();

  // Calculate the total price of the cart items
  const calculateTotalPrice = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (acc, cart) =>
        acc +
        (Array.isArray(cart.items) ? cart.items : []).reduce(
          (subTotal, item) => {
            const price = item.serviceId?.serviceVariants?.[0]?.price || 0;
            return subTotal + price * item.quantity;
          },
          0,
        ),
      0,
    );
    console.log("Total price calculated:", total);
    setTotalPrice(total);
  }, []);

  // Calculate the total number of items in the cart
  const calculateTotalItems = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (acc, cart) => acc + (Array.isArray(cart.items) ? cart.items.length : 0),
      0,
    );
    console.log("Total items calculated:", total);
    setTotalItems(total);
  }, []);

  // Fetch the user's cart
  const fetchCart = useCallback(async () => {
    const userId = user?._id || sessionStorage.getItem("userId");
    if (!userId) {
      console.warn("fetchCart: user or userId is undefined");
      return;
    }

    console.log("Fetching cart for userId:", userId);

    try {
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${userId}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setCartNotFound(true);
          toast.error("Cart not found.");
          console.log("Cart not found for user:", userId);
        }
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
      setCartNotFound(false);
      console.log("Cart data fetched successfully:", data);
    } catch (err) {
      console.error("Failed to fetch cart data:", err);
      toast.error("Failed to fetch cart data");
    }
  }, [user]);

  // Fetch cart on mount or when user/cartId changes
  useEffect(() => {
    if ((user && user._id) || sessionStorage.getItem("userId")) {
      console.log("Fetching cart data on mount or when user/cartId changes.");
      fetchCart();
    }
  }, [user, cartId, fetchCart]);

  // Recalculate total price and items when cartItems changes
  useEffect(() => {
    console.log("Cart items changed, recalculating totals.");
    calculateTotalPrice(cartItems);
    calculateTotalItems(cartItems);
  }, [cartItems, calculateTotalPrice, calculateTotalItems]);

  // Add an item to the cart
  const addToCart = async (item) => {
    console.log("Attempting to add item to cart:", item);

    if (!isAuthenticated) {
      toast.error("User not authenticated");
      console.warn("User is not authenticated. Showing login prompt.");
      showLogin && showLogin(true);
      return;
    }

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/cart/create-cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        },
      );

      if (response.ok) {
        console.log("Item added to cart successfully.");
        await fetchCart();
        toast.success("Item added to cart");
      } else {
        console.error("Failed to add item to cart:", response.statusText);
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Error adding item to cart");
    }
  };

  // Handle adding a service to the cart
  const handleCart = async (serviceId, categoryId, subCategoryId) => {
    const userId = user?._id || sessionStorage.getItem("userId");

    console.log("Attempting to handle cart for service:", {
      serviceId,
      categoryId,
      subCategoryId,
    });

    if (!userId) {
      toast.error("User not authenticated");
      console.warn("User not authenticated. Showing login prompt.");
      showLogin && showLogin(true);
      return;
    }

    const newItem = {
      userId,
      items: [{ serviceId, categoryId, subCategoryId, quantity: 1 }],
    };

    await addToCart(newItem);
  };

  // Remove an item from the cart and show a toast message
  const removeFromCart = (itemId) => {
    console.log("Removing item from cart:", itemId);
    setItemIdToRemove(itemId);
  };

  // Remove the item from the cart when itemIdToRemove is set
  useEffect(() => {
    if (itemIdToRemove === null) return;

    const userId = user?._id || sessionStorage.getItem("userId");
    console.log("Removing item with ID from cart:", itemIdToRemove);

    fetch(
      `https://api.coolieno1.in/v1.0/users/cart/${userId}/${itemIdToRemove}`,
      {
        method: "DELETE",
      },
    )
      .then((response) => {
        if (response.ok) {
          console.log("Item removed successfully.");
          setCartItems((prevItems) =>
            prevItems
              .map((cart) => ({
                ...cart,
                items: cart.items.filter((item) => item._id !== itemIdToRemove),
              }))
              .filter((cart) => cart.items.length > 0),
          );
          toast.success("Item removed from cart");
        } else {
          console.error("Error deleting cart item:", response.statusText);
          toast.error("Error deleting cart item");
        }
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        toast.error("Error deleting cart item");
      })
      .finally(() => setItemIdToRemove(null));
  }, [itemIdToRemove, user]);

  // Update the quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    console.log("Updating quantity for item:", { itemId, newQuantity });
    setCartItems((prevItems) =>
      prevItems.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      })),
    );
  };

  // Clear all cart items when location changes
  const clearCart = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.warn("No user ID found. Cannot clear the cart.");
      return;
    }

    try {
      console.log(`Attempting to clear cart for userId: ${userId}`);
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${userId}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        setCartItems([]);
        toast.success("Cart cleared successfully.");
        console.log("Cart cleared successfully.");
      } else {
        const errorMessage = await response.text(); // Get error message from the response
        console.error(`Failed to clear cart: ${errorMessage}`);
        toast.error(
          `Error clearing the cart: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error clearing the cart:", error);
      toast.error(`Error clearing the cart: ${error.message}`);
    }
  };

  // Function to compress and store pincode in localStorage
  const storePincode = (pincode) => {
    const compressedPincode = LZString.compress(pincode); // Compress the pincode
    localStorage.setItem("userPincode", compressedPincode); // Store in localStorage
  };

  const handleLocationUpdate = async (latitude, longitude, pincode) => {
    const storedPincode = getStoredPincode(); // Get the stored pincode from local storage
    const selectedPincode = String(pincode); // Convert the user-selected pincode to a string

    console.log(`Pincode user chose: ${selectedPincode}`);
    console.log(`Stored pincode: ${storedPincode}`);

    // Check if the chosen pincode and stored pincode are the same
    if (storedPincode === selectedPincode) {
      console.log(
        "Pincode matches. Skipping location update and cart clearing.",
      );
      toast.success("Good! Schedule your services."); // Show success message
      return;
    } else {
      console.log(
        `Updating location. Latitude: ${latitude}, Longitude: ${longitude}, Pincode: ${selectedPincode}`,
      );
      console.log("Clearing cart.");
      clearCart();

      // Call updateUserLocation from AuthContext
      await updateUserLocation(latitude, longitude);

      // Store the new pincode after the cart is cleared and location updated
      storePincode(selectedPincode); // Use storePincode to save the new pincode
      console.log(`New pincode stored: ${selectedPincode}`);

      // Optionally, show a toast message indicating the cart was cleared
      toast.success(
        "Location updated, cart cleared. You can now schedule your services.",
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        fetchCart,
        handleCart,
        cartMessage,
        handleLocationUpdate,
      }}
    >
      {cartNotFound && <div>{cartMessage}</div>}
      {children}
      <Toaster limit={1} />
    </CartContext.Provider>
  );
};
