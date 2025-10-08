import React from "react";
import { resendMechOtp, verifyMechOtp } from "../../Api/mech.ts";
import { setMechCredential } from "../../App/slices/AuthSlice.ts";
import OtpVerificationPage from "../../components/Common/OTP/OtpVerificationPage.tsx";

const MechOtpPage: React.FC = () => {
  const config = {
    verifyOtpFn: verifyMechOtp,
    resendOtpFn: resendMechOtp,
    userDataSelector: (state: any) => state.auth.mechData,
    setCredentialAction: setMechCredential,
    homeRoute: "/mech/homepage",
    successRoute: "/mech/homepage",
    timerKeyPrefix: "mech_otp_timer_",
    icon: "settings" as const,
  };

  return <OtpVerificationPage config={config} />;
};

export default MechOtpPage;
