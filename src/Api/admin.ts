import {
  BlockingResponse,
  DeletingResponse,
} from "../components/Common/TableCommon";
import { InewService } from "../Pages/Admin/NewService";
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
    const result = await Api.get(adminRoutes.getAllUsers);
    return result;
  } catch (error) {
    errorHandler(error as Error);
  }
};

const getAllMechanics = async () => {
  try {
    const result = await Api.get(adminRoutes.getAllMechanic);
    return result;
  } catch (error) {
    errorHandler(error as Error);
  }
};

const blockUser = async (id: string): Promise<BlockingResponse> => {
  try {
    const response = await Api.put(`${adminRoutes.blockUser}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to block/unblock the user.",
    };
  }
};

const blockMech = async (id: string): Promise<BlockingResponse> => {
  try {
    const response = await Api.put(`${adminRoutes.blockMech}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to block/unblock the user.",
    };
  }
};

const listUnlistService = async (id: string): Promise<BlockingResponse> => {
  try {
    console.log("entered in the listUnlistService");
    const response = await Api.put(`${adminRoutes.listUnlistServices}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to List / unlist the services , admin.ts",
    };
  }
};
const deleteUser = async (id: string): Promise<DeletingResponse> => {
  try {
    const response = await Api.put(`${adminRoutes.deleteUser}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to block/unblock the user.",
    };
  }
};

const deleteMech = async (id: string): Promise<DeletingResponse> => {
  try {
    const response = await Api.put(`${adminRoutes.deleteMech}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to Delete the mechanic.",
    };
  }
};


const deleteService = async (id: string): Promise<DeletingResponse> => {
  try {
    console.log("enterd in the admints for deleting service");
    const response = await Api.put(`${adminRoutes.deleteService}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to Delete s the mechanic.",
    };
  }
};

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

const addService = async (values: InewService) => {
  try {
    const result = await Api.post(adminRoutes.addNewService, { values });
    if (result) {
      console.log("Service added successfully");
      return result;
    }
  } catch (error) {
    errorHandler(error as Error);
  }
};

const getAllServices = async () => {
  try {
    console.log("entered in the admin.ts");
    const result = await Api.get(adminRoutes.getAllServices);
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

export {
  adminLogin,
  adminLogout,
  addService,
  getAllServices,
  listUnlistService,
  deleteService,
  getAllUsers,
  blockUser,
  getAllMechanics,
  deleteUser,
  blockMech,
  deleteMech,
};
