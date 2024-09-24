import { FormData } from "../Pages/User/UserSignupPage";
import Api from "../Services/axios";
import userRoutes from "../Services/Endpoints/userEndPoints";

const signup = async ({ name, phone, email, password }: FormData) => {
  try {
    console.log("Entered in signup ");
    const result = await Api.post(userRoutes.signUp, {
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
    return null;
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

export { signup, login, logout, getProfile };
