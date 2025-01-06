import * as Yup from "yup";
import { MOBILE_NUM_REGEX, PIN_CODE_REGEX } from "../../constants/CommonConstants";

const strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%\\^&*])(?=.{5,})"
);

const gmailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$");
const SUPPORTED_FORMATS = ["image/jpg","image/jpeg","image/png"];

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
})

export const LoginValidation = Yup.object({
  email: Yup.string()
    .email("please Enter a valid Email Address!")
    .required("please Enter Email!"),
  password: Yup.string().required("please Enter your password!"),
});

export const newPasswordValidation = Yup.object({
  password: Yup.string().min(8).matches(strongRegex, "Enter a Strong password").required('Please Enter the password!'),
  cpassword: Yup.string().min(8).oneOf([Yup.ref("password")], "Password not matching").required('Please confirm the password!')
})


export const newServiceValidation = Yup.object({
  name:Yup.string().min(3).required("Please enter the Service name!!"),
  discription:Yup.string().min(5).required("Please enter the Discription")
})

export const AddressValidation = Yup.object({
  name:Yup.string().min(3).required("Please enter name"),
  phone:Yup.string()
  .matches(MOBILE_NUM_REGEX,"Enter a valid phone number")
  .min(10)
  .max(10)
  .required("Please enter phone number"),
  email: Yup.string()
  .matches(gmailRegex, "Please enter a valid Email")
  .email("Please Enter Valid Email")
  .required("please Enter Email"),
  state:Yup.string().min(3).required("Please enter you state"),
  pin:Yup.string().matches(PIN_CODE_REGEX,"Enter a valid pin"),
  district:Yup.string().min(3).required("Enter you district name"),
  landMark:Yup.string().required("please enter your landmark")
})

export const ServiceListingValidation = Yup.object({
  name: Yup.string().min(3).required("Service name is required"),
  discription: Yup.string().min(3).required("Description is required"),
  image: Yup.string().required("Image is required"),
})

export const DeviceListingValidation = Yup.object({
  name : Yup.string().min(3).required("Device name is required")
})

export const ServiceFormValidation = Yup.object({
  name:Yup.string()
   .min(3).required("Please Enter Your Name"),
   complaintDiscription:Yup.string().min(5).required("A description is required to help us understand your complaint"),
   file: Yup.mixed()
   .nullable()
   .required("Please upload the image")
   .optional()
   .test('FILE-SIZE',
     "uploaded file is too big", 
     (value) => !value || (value && value.size <= 1024 * 1024)
   )
   .test(
    "FILE FORMAT",
    "Uploaded file has unsupported format",
     (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
   )
})