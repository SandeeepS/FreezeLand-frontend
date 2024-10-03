import Api from "../Services/axios";
import mechRoutes from "../Services/Endpoints/mechEndPoints";
import { FormData } from "../Pages/Mechanic/MechanicSignupPage";

const mechSignup = async ({ name, phone, email, password }: FormData) => {
  try {
    console.log("Entered in mech signup ");
    const result = await Api.post(mechRoutes.signup, {
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
const mechLogin = async (email: string, password: string) => {
  try {
    const result = await Api.post(mechRoutes.login, { email, password });
    console.log("result reached in the frontend ", result);
    return result;
  } catch (error) {
    console.log(error as Error);
  }
};

const verifyMechOtp = async (otpnum: string) => {
  try {
    const otp = parseInt(otpnum);
    const result = await Api.post(mechRoutes.veryfyOtp, { otp });
    return result;
  } catch (error) {
    console.log(error as Error);
  }
};

const forgotPasswordMech = async (email: string) => {
  try {
    return await Api.post(mechRoutes.forgotPasswordMech, { email });
  } catch (error) {
    console.log(error as Error);
  }
};
const forgotVerifyOtpMech = async (otp: string) => {
  try {
    return await Api.post(mechRoutes.forgotVerifyOtpMech, { otp });
  } catch (error) {
    console.log(error as Error);
  }
};
const updateNewPasswordMech = async (password: string, userId: string) => {
  try {
    return await Api.put(mechRoutes.updateNewPasswordMech, {
      password,
      userId,
    });
  } catch (error) {
    console.log(error as Error);
  }
};

const resendMechOtp = async () => {
  try {
    await Api.get(mechRoutes.resendOtp);
  } catch (error) {
    console.log(error as Error);
  }
};

const mLogout = async () => {
  try {
    const result = await Api.get(mechRoutes.logout);
    if (result) {
      console.log("logut success from the admin.ts");
      return result;
    }
  } catch (error) {
    console.log(error as Error);
  }
};

export {
  mechLogin,
  mLogout,
  mechSignup,
  verifyMechOtp,
  resendMechOtp,
  forgotPasswordMech,
  forgotVerifyOtpMech,
  updateNewPasswordMech,
};
