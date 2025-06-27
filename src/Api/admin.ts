import {
  BlockingResponse,
  DeletingResponse,
} from "../interfaces/IComponents/Common/ICommonInterfaces";
import { InewService } from "../interfaces/IPages/Admin/IAdminInterfaces";
import Api from "../Services/axios";
import adminRoutes from "../Services/Endpoints/adminEndPoints";
import { adminErrorHandler} from "./errorHandler";

const adminLogin = async (email: string, password: string) => {
  console.log("entered in the admin login ");
  try {
    const result = await Api.post(adminRoutes.login, { email, password });
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

const updateApprove = async (
  id: string | undefined,
  verificationStatus: boolean | undefined
) => {
  console.log("entered in the updateApprove");
  try {
    console.log("kkkkkk", id, verificationStatus);
    const result = await Api.put(
      adminRoutes.updateApprove,
      {},
      {
        params: { id, verificationStatus },
      }
    );
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

const getImageUrl = async (imageKey: string, type: string) => {
  try {
    const result = await Api.get(adminRoutes.getImageUrl, {
      params: { imageKey, type },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    adminErrorHandler(error as Error);
  }
};

const getAllUsers = async (search: string) => {
  try {
    const result = await Api.get(adminRoutes.getAllUsers, {
      params: { search },
    });
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

const getAllMechanics = async (search: string) => {
  try {
    const result = await Api.get(adminRoutes.getAllMechanic, {
      params: { search },
    });
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

const getMechanicById = async (id: string) => {
  try {
    const result = await Api.get(`${adminRoutes.getMechanicById}/${id}`);
    console.log("mechanic details from teh admin.ts", result);
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
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
    adminErrorHandler(error as Error);
  }
};

const getS3SingUrl = async (
  fileName: string,
  fileType: string,
  folderName: string
) => {
  try {
    console.log(
      "entered in the getS3SingUrl function in the admin.ts file",
      fileName,
      fileType
    );

    const result = await Api.get(adminRoutes.getPresignedUrl, {
      params: { fileName, fileType, folderName },
    });
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

const addService = async (values: InewService) => {
  try {
    console.log("values from the addService from the admin.ts file ", values);
    const result = await Api.post(adminRoutes.addNewService, { values });
    if (result) {
      console.log("Service added successfully");
      return result;
    }
  } catch (error) {
    adminErrorHandler(error as Error);
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
    adminErrorHandler(error as Error);
  }
};

const getAllServices = async (search: string) => {
  try {
    console.log("entered in the admin.ts");
    const result = await Api.get(adminRoutes.getAllServices, {
      params: { search },
    });
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    adminErrorHandler(error as Error);
  }
};

const getAllDevices = async (search: string) => {
  try {
    console.log("entered in the admin.ts for accessing the all devices ");
    const result = await Api.get(adminRoutes.getAllDevices, {
      params: { search },
    });
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
    adminErrorHandler(error as Error);
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
    adminErrorHandler(error as Error);
  }
};

const editExistService = async (
  _id: string | undefined,
  values: InewService
) => {
  try {
    const result = await Api.put(adminRoutes.editExistService, { _id, values });
    console.log("result form front end", result);
    return result;
  } catch (error) {
    console.log(error as Error);
  }
};

//function to get all the compliant registered by the user
const getAllComplaints = async (search:string) => {
  try {
    console.log("search value in the getAllComplaints in the admin.ts", search);
    const result = await Api.get(adminRoutes.getAllComplaints,{
      params: {search},
    });
    return result;
  } catch (error) {
    console.log(error as Error);
  }
};

//function to delete the complaint 
const deleteComplaint = async (id: string): Promise<DeletingResponse> => {
  try {
    console.log("enterd in the admints for deleting device");
    const response = await Api.put(`${adminRoutes.deleteComplaint}${id}`);
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

//listing the complaints and unlisting 
const listUnlistComplaints = async (id: string): Promise<BlockingResponse> => {
  try {
    console.log("entered in the listUnlistDevices");
    const response = await Api.put(`${adminRoutes.listUnlistComplaints}${id}`);
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

//geting the complaint by id
const getComplaintById = async (id: string) => {
  try {
    const result = await Api.get(`${adminRoutes.getComplaintById}/${id}`);
    console.log("complaint details from teh admin.ts", result);
    return result;
  } catch (error) {
    adminErrorHandler(error as Error);
  }
};

//function to cancel the service 
const cancelComplaint = async (complaintId:string, userRole : string,reason:string) =>{
  try{
    console.log("reached in the admin.ts , and complaintId and userRole is ",complaintId,userRole,reason);
    const result = await Api.post(adminRoutes.cancelComplaint,{complaintId,userRole,reason})
    return result;
  }catch(error) {
    console.log("error occured while cancel the comlaint in the admin ts ",error);
    adminErrorHandler(error as Error);
  }
}

//getting all reports 
const getAllReportsByReporterRole = async(reporterRole:string) => {
  try{
    console.log("Entered in the getAllReports in the admin.ts ",reporterRole);
    const result = await Api.get(adminRoutes.getAllReports,{params:{reporterRole}});
    return result;
  }catch(error){
    console.log("Error occured while fetching all reports in the admin.ts getAllReports",error);
    adminErrorHandler(error as Error);
  }
}

//updating report status
const updateReportStatus = async(reportId:string, status: string) => {
  try{
    const response = await Api.put(adminRoutes.updateReportStatus,{reportId,status});
    return response;
  }catch(error){
    console.log("Error occured during updating the reportsstatus from the updateReportStatus in the admin.ts");
    adminErrorHandler(error as Error);
  }
}



export {
  adminLogin,
  adminLogout,
  getS3SingUrl,
  addService,
  addDevice,
  getAllReportsByReporterRole,
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
  getMechanicById,
  getImageUrl,
  updateApprove,
  getAllComplaints,
  listUnlistComplaints,
  deleteComplaint,
  getComplaintById,
  cancelComplaint,
  updateReportStatus
};
