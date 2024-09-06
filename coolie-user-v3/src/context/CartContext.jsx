import React, { createContext, useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children, cartId, showLogin }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemIdToRemove, setItemIdToRemove] = useState(null);
  const [cartNotFound, setCartNotFound] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("CartProvider useEffect [user, cartId]", { user, cartId });
    if ((user && user._id) || sessionStorage.getItem("userId")) {
      fetchCart();
    }
  }, [user, cartId]);

  useEffect(() => {
    calculateTotalPrice(cartItems);
    calculateTotalItems(cartItems);
  }, [cartItems]);

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

  const calculateTotalPrice = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (total, cart) =>
        total +
        (Array.isArray(cart.items) ? cart.items : []).reduce((subTotal, item) => {
          const price =
            item.serviceId &&
            item.serviceId.serviceVariants &&
            item.serviceId.serviceVariants.length > 0
              ? parseFloat(item.serviceId.serviceVariants[0].price)
              : 0;
          return subTotal + price * item.quantity;
        }, 0),
      0
    );
    setTotalPrice(total);
  }, []);
  

  const calculateTotalItems = useCallback((cartItems) => {
    const total = cartItems.reduce(
      (total, cart) =>
        total + (Array.isArray(cart.items) ? cart.items : []).length,
      0,
    );
    setTotalItems(total);
  }, []);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error("User not authenticated");
      if (showLogin) {
        showLogin(true);
      }
      return;
    }

    try {
      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/cart/create-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        },
      );

      if (response.ok) {
        await fetchCart(); // Re-fetch cart items after adding new item
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

  const handleCart = async (serviceId, categoryId, subCategoryId) => {
    const userId = user?._id || sessionStorage.getItem("userId");

    if (!userId) {
      toast.error("User not authenticated");
      if (showLogin) {
        showLogin(true);
      }
      return;
    }

    const newItem = {
      userId,
      items: [
        {
          serviceId,
          categoryId,
          subCategoryId,
          quantity: 1,
        },
      ],
    };

    try {
      await addToCart(newItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = (itemId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to remove this item from the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setItemIdToRemove(itemId);
          },
        },
        {
          label: "No",
          onClick: () => console.log("Delete from cart canceled"),
        },
      ],
    });
  };

  useEffect(() => {
    if (itemIdToRemove !== null) {
      const userId = user?._id || sessionStorage.getItem("userId");

      fetch(
        `https://api.coolieno1.in/v1.0/users/cart/${userId}/${itemIdToRemove}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            setCartItems((prevItems) => {
              const newItems = prevItems
                .map((cart) => ({
                  ...cart,
                  items: (Array.isArray(cart.items) ? cart.items : []).filter(
                    (item) => item._id !== itemIdToRemove,
                  ),
                }))
                .filter((cart) => cart.items.length > 0);
              return newItems;
            });
            toast.success("Item removed from cart");
          } else {
            console.error("Error deleting cart item:", response.statusText);
            toast.error("Error deleting cart item");
          }
        })
        .catch((error) => {
          console.error("Error deleting cart item:", error);
          toast.error("Error deleting cart item");
        });
    }
  }, [itemIdToRemove, user]);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((cart) => ({
        ...cart,
        items: (Array.isArray(cart.items) ? cart.items : []).map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      }));
      return newItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems, // Passing totalItems in the context
        setCartItems,
        calculateTotalPrice,
        calculateTotalItems,
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
