import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { logout } from "./user";
import { store } from "../App/store";
import { userLogout } from "../App/slices/AuthSlice";

type ErrorResponse = {
  message: string;
  success: boolean;
};

const errorHandler = async (error: Error | AxiosError) => {
  try {
    const axiosError = error as AxiosError;
    console.log("Error details:", axiosError);

    if (axiosError.response?.status === 401) {
      console.log("Unauthorized error, logging out...");
      await logout();
      store.dispatch(userLogout());
      const errorMessage =
        (axiosError.response?.data as ErrorResponse)?.message ||
        "Authentication failed";
        console.log("error message in the error hander is ",errorMessage)
      toast.error(errorMessage);
      return;
    }

    if (axiosError.response?.data) {
      const errorResponse = axiosError.response.data as ErrorResponse;
      toast.error(errorResponse.message || "An error occurred");
    } else if (axiosError.message) {
      toast.error(axiosError.message);
    } else {
      toast.error("Something went wrong. Please try again!");
    }
  } catch (error) {
    console.error("Error in errorHandler:", error);
    toast.error("An unexpected error occurred");
    throw error as Error;
  }
};

export default errorHandler;
