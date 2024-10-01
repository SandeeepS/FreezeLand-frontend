import Api from "../Services/axios";
import adminRoutes from "../Services/Endpoints/adminEndPoints";
import errorHandler from "./errorHandler";

const adminLogin = async (email: string, password: string) => {
  console.log("entered in the admin login ");
  try {
    const result = await Api.post(adminRoutes.login, { email, password });
    return result;
  } catch (error) {
    errorHandler(error as Error);
  }
};

const getAllUsers = async () => {
  try {
      const  result = await Api.get(adminRoutes.getAllUsers);
      return result;
  } catch (error) {
      errorHandler(error as Error);
  }
}
const blockUser = async (id: string) => {
  try {
      const result = await Api.put(`${adminRoutes.blockUser}${id}`);
      return result;
  } catch (error) {
      errorHandler(error as Error);
  }
}

const adminLogout = async () => {
  try {
    const result = await Api.get(adminRoutes.logout);
    if (result) {
      console.log("logut success from the admin.ts");
      return result;
    }
  } catch (error) {
    errorHandler(error as Error);
  }
};

export { adminLogin, adminLogout ,getAllUsers,blockUser};
