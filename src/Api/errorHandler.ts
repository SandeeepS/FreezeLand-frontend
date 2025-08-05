import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { logout } from "./user";
import { adminLogout } from "./admin";
import { store } from "../App/store";
import {
  userLogout,
  mechLogout as mechSliceLogout,
  adLogout as adminSliceLogout,
  mechLogout,
} from "../App/slices/AuthSlice";

type ErrorResponse = {
  message: string;
  success: boolean;
  errors?: Record<string, string>;
};

// Base error handler function with explicit return type
const baseErrorHandler = async (
  error: Error | AxiosError,
  logoutFunction: () => Promise<void>,
  logoutAction: () => { type: string }
): Promise<void> => {
  try {
    const axiosError = error as AxiosError;
    console.log("Error details:", axiosError);

    if (!axiosError.response) {
      if (axiosError.code == "ERR_NETWORK") {
        toast.error(
          "Unable to connect to server. Please check your connection or try again later."
        );
      } else if (axiosError.request) {
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        toast.error(axiosError.message || "Error setting up request");
      }
      return;
    }

    const status = axiosError.response.status;
    const errorResponse = axiosError.response.data as ErrorResponse;
    const errorMessage = errorResponse.message || "An error occurred";

    switch (status) {
      case 400:
        if (errorResponse.errors && typeof errorResponse.errors === "object") {
          Object.values(errorResponse.errors).forEach((error) => {
            toast.error(error as string);
          });
        } else {
          toast.error(errorMessage);
        }
        break;

      case 401:
        console.log("Unauthorized error, logging out...");
        await logoutFunction();
        store.dispatch(logoutAction());
        toast.error(errorMessage || "Authentication failed");
        break;

      case 404:
        toast.error(errorMessage || "Resource not found");
        break;

      case 409:
        toast.error(errorMessage || "Conflict with existing data");
        break;

      case 500:
        toast.error(errorMessage || "Server error. Please try again later.");
        break;
   
      default:
        toast.error(errorMessage || `Error: ${status}`);
    }
  } catch (error) {
    console.error("Error in errorHandler:", error);
    toast.error("An unexpected error occurred");
  }
};

// User error handler
export const userErrorHandler = async (
  error: Error | AxiosError
): Promise<void> => {
  return baseErrorHandler(
    error,
    async () => {
      await logout();
    },
    userLogout
  );
};

// Mechanic error handler
export const mechErrorHandler = async (
  error: Error | AxiosError
): Promise<void> => {
  return baseErrorHandler(
    error,
    async () => {
      await mechLogout();
    },
    mechSliceLogout
  );
};

// Admin error handler
export const adminErrorHandler = async (
  error: Error | AxiosError
): Promise<void> => {
  return baseErrorHandler(
    error,
    async () => {
      await adminLogout();
    },
    adminSliceLogout
  );
};

// Default export (for backward compatibility)
export default userErrorHandler;
