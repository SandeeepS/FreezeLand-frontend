import Api from "../Services/axios";
import mechRoutes from "../Services/Endpoints/mechEndPoints";
import { FormData } from "../Pages/Mechanic/MechanicSignupPage";
import errorHandler from "./errorHandler";
import { MechanicForm } from "../Pages/Mechanic/VerifyMechanic";

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
    errorHandler(error as Error);
  }
};
const mechLogin = async (email: string, password: string) => {
  try {
    const result = await Api.post(mechRoutes.login, { email, password });
    console.log("result reached in the frontend ", result);
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const verifyMechOtp = async (otpnum: string) => {
  try {
    const otp = parseInt(otpnum);
    const result = await Api.post(mechRoutes.veryfyOtp, { otp });
    return result;
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const forgotPasswordMech = async (email: string) => {
  try {
    return await Api.post(mechRoutes.forgotPasswordMech, { email });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};
const forgotVerifyOtpMech = async (otp: string) => {
  try {
    return await Api.post(mechRoutes.forgotVerifyOtpMech, { otp });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};
const updateNewPasswordMech = async (password: string, userId: string) => {
  try {
    return await Api.put(mechRoutes.updateNewPasswordMech, {
      password,
      userId,
    });
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
  }
};

const resendMechOtp = async () => {
  try {
    await Api.get(mechRoutes.resendOtp);
  } catch (error) {
    console.log(error);
    errorHandler(error as Error);
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
    errorHandler(error as Error);
  }
};

const getAllMechanics = async () => {
  try {
    const result = await Api.get(mechRoutes.getAllMechanics);
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
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
    errorHandler(error as Error);
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
    errorHandler(error as Error);
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
    errorHandler(error as Error);
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
    errorHandler(error as Error);
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
    errorHandler(error as Error);
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
    errorHandler(error as Error);
  }
};

const getImageUrl = async (imageKey: string, type: string) => {
  try {
    const result = await Api.get(mechRoutes.getImageUrl, {
      params: { imageKey, type },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

const updateWorkAssigned = async (
  complaintId: string,
  mechanicId: string,
  status: string
) => {
  try {
    console.log("ehtered in the updateWorkAssigned");
    const result = await Api.put(mechRoutes.updateWorkAssigned, {
      complaintId,
      mechanicId,
      status,
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
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
    errorHandler(error as Error);
  }
};

//function to update the complaint status by mechanic
const updateComplaintStatus = async (complaintId:string, nextStatus: string) => {
  try {
    console.log("Entered in the updateComplaintStatus",complaintId,nextStatus);
    const result = await Api.put(mechRoutes.updateComplaintStatus,{}, {
      params: {complaintId, nextStatus },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

export {
  mechLogin,
  mLogout,
  mechSignup,
  getImageUrl,
  verifyMechOtp,
  resendMechOtp,
  forgotPasswordMech,
  forgotVerifyOtpMech,
  updateNewPasswordMech,
  getAllMechanics,
  getAllDevices,
  verifyMechanic,
  getComplaintDetails,
  getMechanicDetails,
  getS3SingUrlForMechCredinential,
  getAllUserRegisteredServices,
  updateWorkAssigned,
  getAllAcceptedServices,
  updateComplaintStatus,
};
