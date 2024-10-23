import { FormData } from "../Pages/User/UserSignupPage";
import Api from "../Services/axios";
import userRoutes from "../Services/Endpoints/userEndPoints";
import errorHandler from "./errorHandler";
import { AddAddress } from "../interfaces/AddAddress";

const signup = async ({ name, phone, email, password }: FormData) => {
  try {
    console.log("Entered in signup ");
    const result = await Api.post(userRoutes.signup, {
      name,
      phone,
      email,
      password,
    });
    console.log("result of api post", result);
    return result;
  } catch (error) {
    console.log(error as Error);
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
  }
};

const forgotPassword = async (email: string) => {
  try {
    return await Api.post(userRoutes.forgotPassword, { email });
  } catch (error) {
    console.log(error as Error);
  }
};
const forgotVerifyOtp = async (otp: string) => {
  try {
    return await Api.post(userRoutes.forgotVerifyOtp, { otp });
  } catch (error) {
    console.log(error as Error);
  }
};
const updateNewPassword = async (password: string, userId: string) => {
  try {
    return await Api.put(userRoutes.updateNewPassword, { password, userId });
  } catch (error) {
    console.log(error as Error);
  }
};
const resendOtp = async () => {
  try {
    await Api.get(userRoutes.resendOtp);
  } catch (error) {
    console.log(error as Error);
  }
};

const logout = async () => {
  try {
    return await Api.get(userRoutes.logout);
  } catch (error) {
    console.log("error in the logout in the user.ts", error as Error);
  }
};

const getProfile = async () => {
  try {
    const result = await Api.get(userRoutes.getProfile);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const EditUserDetails = async ({_id, name, phone }: FormData) => {
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
    console.log(error as Error);
  }
};

const AddUserAddress = async (_id:string | undefined,values:AddAddress) => {
  try{
    console.log("Entered in the AddUserAddress fucntion in the user.ts");
    const result = await Api.post(userRoutes.addAddress,{_id,values});
    return result
  }catch(error){
    console.log(error as Error);

  }
} 

export {
  signup,
  login,
  googleLogin,
  logout,
  getProfile,
  verifyOtp,
  resendOtp,
  forgotPassword,
  EditUserDetails,
  forgotVerifyOtp,
  updateNewPassword,
  AddUserAddress
};
