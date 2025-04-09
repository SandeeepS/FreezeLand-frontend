import { FormData } from "../Pages/User/UserSignupPage";
import Api from "../Services/axios";
import userRoutes from "../Services/Endpoints/userEndPoints";
import errorHandler from "./errorHandler";
import { AddAddress } from "../interfaces/AddAddress";
import { Iconcern } from "../interfaces/Iconcern";

const signup = async ({
  name,
  phone,
  email,
  password,
  cpassword,
}: FormData) => {
  try {
    console.log("Entered in signup ");
    const result = await Api.post(userRoutes.signup, {
      name,
      phone,
      email,
      password,
      cpassword,
    });
    console.log("result of api post", result);
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const login = async (email: string, password: string) => {
  try {
    console.log("entered in the login Api");
    const result = await Api.post(userRoutes.login, { email, password });
    console.log("result from the fronEnd is ", result);
    return result;
  } catch (error) {
    console.log("error from the login from the ueser.ts", error as Error);
    errorHandler(error as Error);
  }
};

const getImageUrl = async (imageKey: string, type: string) => {
  try {
    const result = await Api.get(userRoutes.getImageUrl, {
      params: { imageKey, type },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

const googleLogin = async (
  name: string | null,
  email: string | null,
  googlePhotoUrl: string | null
) => {
  try {
    if (!name || !email) return;
    const result = await Api.post(userRoutes.googleLogin, {
      name,
      email,
      googlePhotoUrl,
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    if (error) console.log(error);
    console.log("error coming from here...");
  }
};

const verifyOtp = async (otpnum: string) => {
  try {
    const otp = parseInt(otpnum);
    const result = await Api.post(userRoutes.veryfyOtp, { otp });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

const forgotPassword = async (email: string) => {
  try {
    return await Api.post(userRoutes.forgotPassword, { email });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};
const forgotVerifyOtp = async (otp: string) => {
  try {
    return await Api.post(userRoutes.forgotVerifyOtp, { otp });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};
const updateNewPassword = async (password: string, userId: string) => {
  try {
    return await Api.put(userRoutes.updateNewPassword, { password, userId });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};
const resendOtp = async () => {
  try {
    await Api.get(userRoutes.resendOtp);
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const logout = async () => {
  try {
    console.log("entered in the logout function user.ts");
    return await Api.get(userRoutes.logout);
  } catch (error) {
    console.log("error in the logout in the user.ts", error as Error);
    errorHandler(error as Error);
  }
};

const getProfile = async (userId: string) => {
  try {
    console.log(
      "Entered in the getProfile in the user.ts and the userId is ",
      userId
    );
    const result = await Api.get(userRoutes.getProfile, { params: { userId } });
    console.log("UserProfile form the backend in the user.ts is ", result);
    return result;
  } catch (error) {
    console.log("error while accessing the user details in the user.ts", error);
    errorHandler(error as Error);
  }
};

//getting services provided by the compnay eg:A/C installation .
const getAllServices = async () => {
  try {
    console.log("entered in the user.ts");
    const result = await Api.get(userRoutes.getAllServices);
    if (result) {
      return result;
    }
  } catch (error) {
    console.log("error in the user.ts");
    console.log(error);
    errorHandler(error as Error);
  }
};

//getting all registered complaint of the user
const getAllUserRegisteredServices = async (userId: string) => {
  try {
    const result = await Api.get(userRoutes.getAllUserRegisteredServices, {
      params: { userId },
    });
    console.log("details reached in the user.ts tttt", result);
    return result.data;
  } catch (error) {
    console.log(
      "error occured while fetching the user registerd services form the user.ts"
    );
    errorHandler(error as Error);
  }
};

const EditUserDetails = async ({ _id, name, phone }: FormData) => {
  try {
    console.log("Entered in the EditUserDetails in the user.ts");
    const result = await Api.put(userRoutes.editUser, {
      _id,
      name,
      phone,
    });
    console.log("result from the backend is ", result);
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const AddUserAddress = async (_id: string | undefined, values: AddAddress) => {
  try {
    console.log(
      "Entered in the AddUserAddress fucntion in the user.ts  and the id is",
      _id
    );
    const result = await Api.post(userRoutes.addAddress, { _id, values });
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const EditExistAddress = async (
  _id: string | undefined,
  addressId: string | undefined,
  values: AddAddress
) => {
  try {
    const result = await Api.put(userRoutes.editAddress, {
      _id,
      addressId,
      values,
    });
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const setDefaultAddress = async (
  userId: string | undefined,
  addressId: string | undefined
) => {
  try {
    const result = await Api.put(userRoutes.setDefaultAddress, {
      userId,
      addressId,
    });
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const registerComplaint = async (data: Iconcern) => {
  try {
    console.log("enterd in the registerCompaint funciton in the user.ts", data);
    const result = await Api.post(userRoutes.registerService, { data });
    console.log("result after registering the user complaint is ", result);
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

const getUserRegisteredServiceDetailsById = async (id: string) => {
  try {
    console.log(
      "Entered in the getUserRegisteredServiceDetailsById in the user.ts"
    );
    const result = await Api.get(
      userRoutes.getUserRegisteredServiceDetailsById,
      { params: { id } }
    );
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

const getMechanicDetails = async (id: string) => {
  try {
    if (!id) {
      console.warn("Mechanic ID is undefined or null in the user.ts");
      return;
    }
    console.log("Fetching mechanic details for ID in the user.ts:", id);
    const response = await Api.get(userRoutes.getMechanicDetails,{
      params: { id },
    });
    console.log("Response from backend in the user.ts:", response);
    return response;
  } catch (error) {
    console.error("Error fetching mechanic details in the user.ts:", error);
    errorHandler(error as Error);
  }
};

export {
  signup,
  login,
  googleLogin,
  logout,
  getProfile,
  verifyOtp,
  resendOtp,
  getImageUrl,
  forgotPassword,
  EditUserDetails,
  EditExistAddress,
  forgotVerifyOtp,
  updateNewPassword,
  AddUserAddress,
  setDefaultAddress,
  getMechanicDetails,
  registerComplaint,
  getAllServices,
  getAllUserRegisteredServices,
  getUserRegisteredServiceDetailsById,
};
