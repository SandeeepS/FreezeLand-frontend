import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { logout } from "./user";
import { store } from "../App/store";
import { userLogout } from "../App/slices/AuthSlice";

type ErrorResponse = {
  message: string;
  success: boolean;
  errors?: Record<string, string>;
};

const errorHandler = async (error: Error | AxiosError) => {
  try {
    const axiosError = error as AxiosError;
    console.log("Error details:", axiosError);

    // Handle case when there's no response (network error)
    if (!axiosError.response) {
      if (axiosError.request) {
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        toast.error(axiosError.message || "Error setting up request");
      }
      return;
    }

    // Get status and error data
    const status = axiosError.response.status;
    const errorResponse = axiosError.response.data as ErrorResponse;
    const errorMessage = errorResponse.message || "An error occurred";

    // Handle different status codes
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
        await logout();
        store.dispatch(userLogout());
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

export default errorHandler;
