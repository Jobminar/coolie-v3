import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "./AuthContext";

// Creating the Cart Context
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
    setTotalPrice(total);
  }, []);

  // Calculate the total number of items in the cart
  const calculateTotalItems = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (acc, cart) => acc + (Array.isArray(cart.items) ? cart.items.length : 0),
      0,
    );
    setTotalItems(total);
  }, []);

  // Fetch the user's cart
  // Fetch the user's cart
  const fetchCart = useCallback(async () => {
    const userId = user?._id || sessionStorage.getItem("userId");
    if (!userId) {
      console.warn("fetchCart: user or userId is undefined");
      return;
    }

    try {
      const response = await fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${userId}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setCartNotFound(true);
          toast.error("Cart not found."); // Trigger the toast notification here
        }
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
      setCartNotFound(false); // Reset cartNotFound if cart is found
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart data");
    }
  }, [user]);

  // Fetch cart on mount or when user/cartId changes
  useEffect(() => {
    if ((user && user._id) || sessionStorage.getItem("userId")) {
      fetchCart();
    }
  }, [user, cartId, fetchCart]);

  // Recalculate total price and items when cartItems changes
  useEffect(() => {
    calculateTotalPrice(cartItems);
    calculateTotalItems(cartItems);
  }, [cartItems, calculateTotalPrice, calculateTotalItems]);

  // Add an item to the cart
  const addToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error("User not authenticated");
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
        await fetchCart();
        toast.success("Item added to cart");
      } else {
        toast.error("Failed to add item to cart");
        console.error("Failed to add item to cart:", response.statusText);
      }
    } catch (error) {
      toast.error("Error adding item to cart");
      console.error("Error adding item to cart:", error);
    }
  };

  // Handle adding a service to the cart
  const handleCart = async (serviceId, categoryId, subCategoryId) => {
    const userId = user?._id || sessionStorage.getItem("userId");

    if (!userId) {
      toast.error("User not authenticated");
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
    setItemIdToRemove(itemId); // Set item to be removed
  };

  // Remove the item from the cart when itemIdToRemove is set
  useEffect(() => {
    if (itemIdToRemove === null) return;

    const userId = user?._id || sessionStorage.getItem("userId");
    fetch(
      `https://api.coolieno1.in/v1.0/users/cart/${userId}/${itemIdToRemove}`,
      {
        method: "DELETE",
      },
    )
      .then((response) => {
        if (response.ok) {
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
          toast.error("Error deleting cart item");
          console.error("Error deleting cart item:", response.statusText);
        }
      })
      .catch((error) => {
        toast.error("Error deleting cart item");
        console.error("Error deleting cart item:", error);
      })
      .finally(() => setItemIdToRemove(null));
  }, [itemIdToRemove, user]);

  // Update the quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      })),
    );
  };
  //Delete all cart items when location changes
  const clearCart = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        `https://api.example.com/cart/clear/${userId}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        setCartItems([]);
        toast.success("Cart cleared successfully.");
      } else {
        throw new Error("Failed to clear cart.");
      }
    } catch (error) {
      toast.error("Error clearing the cart.");
      console.error(error);
    }
  };

  const handleLocationUpdate = async (latitude, longitude) => {
    // Call updateUserLocation from AuthContext
    await updateUserLocation(latitude, longitude);

    // Clear the cart when location is updated
    clearCart();
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
        clearCart,
        handleLocationUpdate,
      }}
    >
      {cartNotFound && <div>{cartMessage}</div>}
      {children}
      <Toaster limit={1} />
    </CartContext.Provider>
  );
};
