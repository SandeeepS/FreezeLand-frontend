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

//listing the devices and unlisting the devices
const listUnlistDevices = async (id: string): Promise<BlockingResponse> => {
  try {
    console.log("entered in the listUnlistDevices");
    const response = await Api.put(`${adminRoutes.listUnlistDevices}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to List / unlist the Devices , admin.ts",
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


const deleteDevice = async (id: string): Promise<DeletingResponse> => {
  try {
    console.log("enterd in the admints for deleting device");
    const response = await Api.put(`${adminRoutes.deleteDevice}${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error as Error);
    return {
      success: false,
      message: "Failed to Delete  the device.",
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

const getS3SingUrl = async (fileName:string,fileType:string) => {
  try {
    console.log("entered in the getS3SingUrl function in the admin.ts file",fileName,fileType);
    const result = await Api.post(adminRoutes.getPresignedUrl, { fileName,fileType });
    return result;
  } catch (error) {
    errorHandler(error as Error);
  }
}

const addService = async (values: InewService) => {
  try {
    console.log("values from the addService from the admin.ts file ", values);
    const result = await Api.post(adminRoutes.addNewService, { values  });
    if (result){
      console.log("Service added successfully");
      return result;
    }
  } catch (error) {
    errorHandler(error as Error);
  }
};

const addDevice = async (name: string) => {
  try {
    console.log(
      "Device name  from the addService from the admin.ts file ",
      name
    );
    const result = await Api.post(adminRoutes.addNewDevice, { name });
    if (result) {
      console.log("Divice  added successfully");
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

const getAllDevices = async () => {
  try {
    console.log("entered in the admin.ts for accessing the all devices ");
    const result = await Api.get(adminRoutes.getAllDevices);
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const getService = async (id: string | undefined) => {
  try {
    console.log("entered in the getService funciton in the admin ts", id);
    const result = await Api.get(`${adminRoutes.getService}${id}`);
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const editExistService = async (
  _id: string | undefined,
  values: InewService
) => {
  try {
    const result = await Api.put(adminRoutes.editExistService, { _id, values });
    return result;
  } catch (error) {
    console.log(error as Error);
  }
};

export {
  adminLogin,
  adminLogout,
  getS3SingUrl,
  addService,
  addDevice,
  getAllServices,
  getService,
  getAllDevices,
  listUnlistService,
  listUnlistDevices,
  editExistService,
  deleteService,
  deleteDevice,
  getAllUsers,
  blockUser,
  getAllMechanics,
  deleteUser,
  blockMech,
  deleteMech,
};
