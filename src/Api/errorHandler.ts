import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ErrorResponse = {
  message: string;
  success: boolean;
};

const errorHandler = async (error: Error | AxiosError) => {
  try {
    const axiosError = error as AxiosError;

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
