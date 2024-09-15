import React, { createContext, useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext";

// Creating the Cart Context
export const CartContext = createContext();

// CartProvider component that will wrap other components
export const CartProvider = ({ children, cartId, showLogin }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);
  const [cartNotFound, setCartNotFound] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const { user, isAuthenticated } = useAuth();

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
          setCartMessage("Cart not found.");
        }
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart data");
    }
  }, [user]);

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

  // Remove an item from the cart with confirmation
  const removeFromCart = (itemId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to remove this item from the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: () => setItemIdToRemove(itemId),
        },
        {
          label: "No",
          onClick: () => console.log("Delete from cart canceled"),
        },
      ],
    });
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
      }}
    >
      {cartNotFound && <div>{cartMessage}</div>}
      {children}
      <Toaster />
    </CartContext.Provider>
  );
};
