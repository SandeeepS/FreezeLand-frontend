import * as Yup from "yup";
import {
  MOBILE_NUM_REGEX,
  PIN_CODE_REGEX,
} from "../../constants/CommonConstants";

const strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%\\^&*])(?=.{5,})"
);

const gmailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$");

export const SignupValidation = Yup.object({
  name: Yup.string().min(3).required("Please Enter name"),
  email: Yup.string()
    .matches(gmailRegex, "Please enter a valid Email")
    .email("Please Enter Valid Email")
    .required("please Enter Email"),
  phone: Yup.string()
    .matches(MOBILE_NUM_REGEX, "Enter a valid Phone number")
    .min(10)
    .max(10)
    .required("Please Enter Phone number"),
  password: Yup.string()
    .matches(strongRegex, "Enter a Strong password")
    .min(5)
    .required("please Enter password!"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password not matching")
    .required("please Enter the confirm password!"),
});

export const EditUserValidation = Yup.object({
  _id: Yup.string(),
  name: Yup.string().min(3).required("Please Enter name"),
  // email: Yup.string()
  //   .matches(gmailRegex, "Please enter a valid Email")
  //   .email("Please Enter Valid Email")
  //   .required("please Enter Email"),
  phone: Yup.string()
    .matches(MOBILE_NUM_REGEX, "Enter a valid Phone number")
    .min(10)
    .max(10)
    .required("Please Enter Phone number"),
});

export const LoginValidation = Yup.object({
  email: Yup.string()
    .email("please Enter a valid Email Address!")
    .required("please Enter Email!"),
  password: Yup.string().required("please Enter your password!"),
});

export const NewPasswordValidation = Yup.object({
  password: Yup.string()
    .min(8)
    .matches(strongRegex, "Enter a Strong password")
    .required("Please Enter the password!"),
  cpassword: Yup.string()
    .min(8)
    .oneOf([Yup.ref("password")], "Password not matching")
    .required("Please confirm the password!"),
});

export const NewServiceValidation = Yup.object({
  name: Yup.string().min(3).required("Please enter the Service name!!"),
  discription: Yup.string().min(5).required("Please enter the Discription"),
});

export const AddressValidation = Yup.object({
  name: Yup.string().min(3).required("Please enter name"),
  phone: Yup.string()
    .matches(MOBILE_NUM_REGEX, "Enter a valid phone number")
    .min(10)
    .max(10)
    .required("Please enter phone number"),
  email: Yup.string()
    .matches(gmailRegex, "Please enter a valid Email")
    .email("Please Enter Valid Email")
    .required("please Enter Email"),
  state: Yup.string().min(3).required("Please enter you state"),
  pin: Yup.string().matches(PIN_CODE_REGEX, "Enter a valid pin"),
  district: Yup.string().min(3).required("Enter you district name"),
  landMark: Yup.string().required("please enter your landmark"),
});

export const ServiceListingValidation = Yup.object({
  name: Yup.string().min(3).required("Service name is required"),
  discription: Yup.array()
    .of(Yup.string().min(3, "Each description must be at least 3 characters"))
    .min(1, "At least one description is required"),
  serviceCharge: Yup.number()
    .required("Service charge is required")
    .min(1, "Service charge must be greater than zero"),
});

export const DeviceListingValidation = Yup.object({
  name: Yup.string().min(3).required("Device name is required"),
});

export const ServiceFormValidation = Yup.object({
  name: Yup.string().min(3).required("Please Enter Your Name"),
  discription: Yup.string()
    .min(5)
    .required("A description is required to help us understand your complaint"),
  files: Yup.array()
    .of(Yup.mixed().required("File is required"))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

  defaultAddress: Yup.string().required("Please Select the address"),
});

export const MechanicVerificationValidationSchema = Yup.object({
  mechanicType: Yup.array()
    .min(1, "Select at least one mechanic type")
    .required("Mechanic type is required"),
  photo: Yup.mixed()
    .required("Photo is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 10 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/gif"].includes((value as File).type)
      );
    }),
  adharProof: Yup.mixed()
    .required("Adhar proof is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 10 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/pdf"].includes((value as File).type)
      );
    }),
  employeeLicense: Yup.mixed()
    .required("Employee license is required")
    .test("fileSize", "File too large", (value) => {
      return value && (value as File).size <= 10 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/pdf"].includes((value as File).type)
      );
    }),
});
