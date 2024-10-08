import * as Yup from "yup";
import { MOBILE_NUM_REGEX } from "../../constants/CommonConstants";

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
