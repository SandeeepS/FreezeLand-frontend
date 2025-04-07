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
    console.log(" jkhfodshfodsfhosdhfosdfhsd",axiosError)
    if(axiosError.status === 401){
      console.log("Unauthorized error, logging out...");
      await logout(); 
      store.dispatch(userLogout())
      toast.error(axiosError.message);
      return;
    }
    if (axiosError.response?.data) {
      const errorResponse = axiosError.response.data as ErrorResponse;
      if (errorResponse.message === "User is blocked by admin!") {
        toast.error(errorResponse.message);
      } else if (
        errorResponse.message === "Professional is blocked by admin!"
      ) {
        toast.error(errorResponse.message);
      } else {
        toast.error(errorResponse.message);
      }
    } else {
      toast.error("Something went wrong.Please try again!");
    }
  } catch (error) {
    throw error as Error;
  }
};

export default errorHandler;
