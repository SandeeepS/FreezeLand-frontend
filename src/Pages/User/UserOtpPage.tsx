import React from "react";
import { resendOtp, verifyOtp } from "../../Api/user";
import { setUserCredental } from "../../App/slices/AuthSlice.ts";
import OtpVerificationPage from "../../components/Common/OTP/OtpVerificationPage.tsx";

const UserOtpPage: React.FC = () => {
  const config = {
    verifyOtpFn: verifyOtp,
    resendOtpFn: resendOtp,
    userDataSelector: (state: any) => state.auth.userData,
    setCredentialAction: setUserCredental,
    homeRoute: "/user/home",
    successRoute: "/auth/login",
    timerKeyPrefix: "otp_timer_",
    icon: "email" as const,
  };

  return <OtpVerificationPage config={config} />;
};

export default UserOtpPage;