// ToastContext.js
import { createContext, useContext } from "react";

// Create the ToastContext
export const ToastContext = createContext();

// Hook to use ToastContext
export const useToast = () => useContext(ToastContext);
