import React from "react";
import {
  forgotPasswordMech,
  forgotVerifyOtpMech,
  updateNewPasswordMech,
} from "../../Api/mech";
import CommonForgetPassword from "../../components/Common/ForgotPassword/CommonForgetPassword";

const ForgetPasswordForMech: React.FC = () => {
  return (
    <CommonForgetPassword
      userType="mechanic"
      apiCalls={{
        forgotPassword: forgotPasswordMech,
        verifyOtp: forgotVerifyOtpMech,
        updatePassword: updateNewPasswordMech,
      }}
      loginRoute="/mech/login"
      iconType="wrench"
    />
  );
};

export default ForgetPasswordForMech;
