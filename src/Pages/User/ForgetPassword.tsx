import React from "react";
import {
  forgotPassword,
  forgotVerifyOtp,
  updateNewPassword,
} from "../../Api/user";
import CommonForgetPassword from "../../components/Common/ForgotPassword/CommonForgetPassword";

const ForgetPassword: React.FC = () => {
  return (
    <CommonForgetPassword
      userType="user"
      apiCalls={{
        forgotPassword: forgotPassword,
        verifyOtp: forgotVerifyOtp,
        updatePassword: updateNewPassword,
      }}
      loginRoute="/auth/login"
      iconType="lock"
    />
  );
};

export default ForgetPassword;