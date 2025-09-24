import Api from "../Services/axios";
import mechRoutes from "../Services/Endpoints/mechEndPoints";
import {
  EditMechanicFormData,
  FormData,
  MechanicForm,
} from "../interfaces/IPages/Mechanic/IMechanicInterfaces";
import { AddAddress } from "../interfaces/AddAddress";
import { mechErrorHandler } from "./errorHandler";
import { IReportData } from "../components/Common/Report/ReportModal";
import { IAddress } from "../interfaces/IComponents/Common/ICommonInterfaces";

const mechSignup = async ({
  name,
  phone,
  email,
  password,
  cpassword,
}: FormData) => {
  try {
    console.log("Entered in mech signup ");
    const result = await Api.post(mechRoutes.signup, {
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
    mechErrorHandler(error as Error);
  }
};
const mechLogin = async (email: string, password: string) => {
  try {
    const result = await Api.post(mechRoutes.login, { email, password });
    console.log("result reached in the frontend ", result);
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const verifyMechOtp = async (id: string, otpnum: string) => {
  try {
    const otp = parseInt(otpnum);
    const result = await Api.post(mechRoutes.veryfyOtp, { id, otp });
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const forgotPasswordMech = async (email: string) => {
  try {
    return await Api.post(mechRoutes.forgotPasswordMech, { email });
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};
const forgotVerifyOtpMech = async (otp: string) => {
  try {
    return await Api.post(mechRoutes.forgotVerifyOtpMech, { otp });
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

//function to update the new password of the user
const updateNewPasswordMech = async (password: string, mechId: string) => {
  try {
    return await Api.put(mechRoutes.updateNewPasswordMech, {
      password,
      mechId,
    });
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const resendMechOtp = async (tempMechId: string) => {
  try {
    const result = await Api.post(mechRoutes.resendOtp, { tempMechId });
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const resendOtp_forgetPassword_mechanic = async () => {
  try {
    const result = await Api.post(mechRoutes.resendOtp_forgetPassword_mechanic);
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
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
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const getAllMechanics = async () => {
  try {
    const result = await Api.get(mechRoutes.getAllMechanics);
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

//signedUrl
const getS3SingUrlForMechCredinential = async (
  fileName: string,
  fileType: string,
  name: string
) => {
  try {
    console.log(
      "entered in the getS3SingUrl function in the mech.ts file",
      fileName,
      fileType
    );

    const result = await Api.get(mechRoutes.getS3SingUrlForMechCredinential, {
      params: { fileName, fileType, name },
    });
    return result;
  } catch (error) {
    mechErrorHandler(error as Error);
  }
};

const getAllDevices = async () => {
  try {
    console.log("entered in the admin.ts for accessing the all devices ");
    const result = await Api.get(mechRoutes.getAllDevices);
    console.log("result from the backedn in the mech.ts is ", result);
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

const verifyMechanic = async (values: MechanicForm) => {
  try {
    console.log("entered in the verigy Mechinc in mech.ts");
    console.log("values in the frontend mech.ts is ", values);
    const response = await Api.post(mechRoutes.VerifyMechanic, { values });
    return response;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

const getMechanicDetails = async (id: string) => {
  try {
    if (!id) {
      console.warn("Mechanic ID is undefined or null");
      return;
    }
    console.log("Fetching mechanic details for ID:", id);
    const response = await Api.get(mechRoutes.getMechanicDetails, {
      params: { id },
    });
    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error fetching mechanic details:", error);
    mechErrorHandler(error as Error);
  }
};

//function to get all userRegistered compliants in the mechside
const getAllUserRegisteredServices = async () => {
  try {
    const result = await Api.get(mechRoutes.getAllUserRegisteredServices);
    console.log("details reached in the mech.ts tttt", result);
    return result.data;
  } catch (error) {
    console.log(
      "error occured while fetching the user registerd services form the mech.ts"
    );
    mechErrorHandler(error as Error);
  }
};

//function to get the specified complaint by id
const getComplaintDetails = async (id: string) => {
  try {
    console.log("Entered in the getComplaintDetails in the mech.ts");
    const result = await Api.get(mechRoutes.getComplaintDetails, {
      params: { id },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

//function to get image url for mechanic
const getImageUrl = async (imageKey: string, type: string) => {
  try {
    const result = await Api.get(mechRoutes.getImageUrl, {
      params: { imageKey, type },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

const updateWorkAssigned = async (
  complaintId: string,
  mechanicId: string,
  status: string,
  roomId: string
) => {
  try {
    console.log("ehtered in the updateWorkAssigned");
    const result = await Api.put(mechRoutes.updateWorkAssigned, {
      complaintId,
      mechanicId,
      status,
      roomId,
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

//function to get all accepted cmpliants by teh mechanic
const getAllAcceptedServices = async (mechanicId: string) => {
  try {
    console.log("Entered in the getAllAcceptedService");
    const result = await Api.get(mechRoutes.getAllAcceptedServices, {
      params: { mechanicId },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

const getAllCompletedServices = async (mechanicId: string) => {
  try {
    console.log("Entered in the getAllCompleted in the mech.ts", mechanicId);
    const result = await Api.get(mechRoutes.getAllCompletedServices, {
      params: { mechanicId },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

//function to update the complaint status by mechanic
const updateComplaintStatus = async (
  complaintId: string,
  nextStatus: string
) => {
  try {
    console.log(
      "Entered in the updateComplaintStatus",
      complaintId,
      nextStatus
    );
    const result = await Api.put(
      mechRoutes.updateComplaintStatus,
      {},
      {
        params: { complaintId, nextStatus },
      }
    );
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

//editing mechanic Details
const updateMechanicDetails = async (
  mechId: string,
  values: EditMechanicFormData
) => {
  try {
    console.log(
      "Entered in the updateMechanicDetails in the mech.ts",
      mechId,
      values
    );
    const result = await Api.put(mechRoutes.editMechanic, {
      mechId,
      values,
    });
    console.log("result from the backend is ", result);
    return result;
  } catch (error) {
    console.log(error as Error);
    mechErrorHandler(error as Error);
  }
};

const createRoom = async (userId: string, mechId: string) => {
  try {
    console.log("Entered in the createRoom funciton in the mechts");
    const result = await Api.post(mechRoutes.createRoom, { userId, mechId });
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

//function to update the workDetails by mechanic
const updateWorkDetails = async (complaintId: string, workDetails: object) => {
  try {
    console.log("reached in the updateWorkDetails ", complaintId, workDetails);
    const result = await Api.post(mechRoutes.updateWorkDetails, {
      complaintId,
      workDetails: workDetails,
    });
    return result;
  } catch (error) {
    console.log("Error while updating the workdetails in the mech.ts");
    mechErrorHandler(error as Error);
  }
};

//adding mechanic address
const AddMechAddress = async (newAddress: IAddress) => {
  try {
    console.log("address for stroing is ", newAddress);
    const result = await Api.post(mechRoutes.addMechAddress, { newAddress });
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

//editing the existing address
const EditExistingMechAddress = async (
  _id: string | undefined,
  addressId: string | undefined,
  values: AddAddress
) => {
  try {
    const result = await Api.put(mechRoutes.editAddress, {
      _id,
      addressId,
      values,
    });
    return result;
  } catch (error) {
    console.log(error);
    mechErrorHandler(error as Error);
  }
};

//function to create a report in mechanic side
const createReport = async (reportData: IReportData) => {
  try {
    console.log("reportdata in the mechts. CreateReport", reportData);
    const result = await Api.post(mechRoutes.createRoute, { reportData });
    return result;
  } catch (error) {
    console.log("Error while creating a report in the mech.ts", error);
    mechErrorHandler(error as Error);
  }
};

//funtion to remove the mechAddress
const handleRemoveMechAddress = async (mechId: string, addressId: string) => {
  try {
    const result = await Api.put(mechRoutes.handleRemoveMechAddress, {
      mechId,
      addressId,
    });
    return result;
  } catch (error) {
    console.log(
      "Error occured in the mech.ts while handleRemoveMechAddress",
      error
    );
    mechErrorHandler(error as Error);
  }
};

//function to get all the address of the mechanic.
const getMechanicAddress = async (mechanicId: string) => {
  try {
    const result = await Api.get(mechRoutes.getMechanicAddress, {
      params: { mechanicId },
    });
    return result;
  } catch (error) {
    console.log("Error occured while accessing the mechanic address", error);
    mechErrorHandler(error as Error);
  }
};

export {
  mechLogin,
  createRoom,
  mLogout,
  mechSignup,
  createReport,
  getImageUrl,
  verifyMechOtp,
  resendMechOtp,
  updateWorkDetails,
  forgotPasswordMech,
  forgotVerifyOtpMech,
  updateNewPasswordMech,
  getAllMechanics,
  getAllDevices,
  verifyMechanic,
  getComplaintDetails,
  getMechanicAddress,
  resendOtp_forgetPassword_mechanic,
  getMechanicDetails,
  getS3SingUrlForMechCredinential,
  getAllUserRegisteredServices,
  getAllCompletedServices,
  updateWorkAssigned,
  getAllAcceptedServices,
  updateComplaintStatus,
  updateMechanicDetails,
  AddMechAddress,
  EditExistingMechAddress,
  handleRemoveMechAddress,
};
