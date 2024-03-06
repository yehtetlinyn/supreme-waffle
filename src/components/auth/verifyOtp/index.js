"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import authStyles from "@/components/auth/auth.module.css";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import {
  VERIFY_PASSWORD_OTP,
  RESEND_PASSWORD_OTP,
} from "@/graphql/mutations/auth";

import Countdown, { zeroPad } from "react-countdown";

import OTPInput from "react-otp-input";
import VerifyOtpLogo from "@/assets/icons/verifyOtpLogo";
import VerifyOtpLogoIcon from "@/assets/icons/verifyOtpLogoIcon";
import useAuthStore from "@/store/authStore";

const VerifyOtp = () => {
  const clockRef = useRef(null);
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState({
    key: Date.now(),
    time: Date.now() + 90000,
  });

  const {
    loading,
    error,
    success,
    requestOtpInfo,
    verifyOtpInfo,
    resendOtpInfo,
    setVerifyOtpInfo,
    setResendOtpInfo,
  } = useAuthStore();

  const [verifyPasswordOtp, { loading: resetPwdLoading }] = useMutation(
    VERIFY_PASSWORD_OTP,
    {
      client: apolloClient,
      onCompleted(data) {
        const { data: successData, error } = data?.verifyOtp;
        setVerifyOtpInfo(successData);
        setErrorMsg(error?.message);
      },
      onError: (error) => {},
    }
  );

  const [resendPasswordOtp, { loading: resendPwdLoading }] = useMutation(
    RESEND_PASSWORD_OTP,
    {
      client: apolloClient,
      onCompleted(data) {
        const { data: successData, error } = data?.resendOtp;
        setResendOtpInfo(successData);
        setErrorMsg(error?.message);
      },
      onError: (error) => {},
    }
  );

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setIsCompleted(true);
      return null;
    } else {
      return (
        <div className="inline-flex items-center">
          code expires in{" "}
          <span className="text-danger">
            {zeroPad(minutes)}:{zeroPad(seconds)}
          </span>
        </div>
      );
    }
  };

  const resetLoading = loading || resetPwdLoading;
  const resendLoading = loading || resendPwdLoading;

  const handleOtpChange = (newOtp) => {
    setOtpCode(newOtp);
  };

  const handleCountdownComplete = () => {
    setCountdown({ time: Date.now() });
    setIsCompleted(false);
  };

  // Method to handle otp submit
  const handleSubmitOtp = () => {
    verifyPasswordOtp({
      variables: {
        identifier: requestOtpInfo?.email,
        otpCode: otpCode,
      },
    });
  };

  // Method to handle otp resend
  const handleResendOtp = () => {
    const countLimit = Date.now() + 90000;
    setCountdown({ key: countLimit, time: countLimit });
    setIsCompleted(false);

    resendPasswordOtp({
      variables: {
        identifier: requestOtpInfo?.email,
      },
    });
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && otpCode.length === 4) {
      handleSubmitOtp();
    }
  };

  useEffect(() => {
    if (otpCode) setErrorMsg("");
  }, [otpCode]);

  useEffect(() => {
    if (verifyOtpInfo) {
      router.push("/auth/resetPassword");
    } else if (resendOtpInfo) {
      router.push("/auth/verifyOtp");
    } else if (!requestOtpInfo) {
      router.push("/auth/login");
    }
  }, [verifyOtpInfo, resendOtpInfo, requestOtpInfo]);

  return (
    <div
      className={`m-0 ${authStyles.bodyContainer}`}
      style={{ padding: "0 5rem 2rem", textAlign: "justify" }}
    >
      <div className={`${authStyles.logo}`}>
        <VerifyOtpLogoIcon />
      </div>
      <h5 className={`${authStyles.header} mb-2 align-self-start`}>
        Enter Authentication code
      </h5>
      <p className={`${authStyles.subHeader} mb-3 align-self-start`}>
        Enter your email address and you will receive a verification code.
      </p>
      <div className="w-100">
        <div className="mb-5">
          <div className="w-75 mx-auto">
            <OTPInput
              value={otpCode}
              shouldAutoFocus
              onChange={handleOtpChange}
              numInputs={4}
              renderSeparator={<span></span>}
              inputStyle={{ width: "40px", height: "40px" }}
              renderInput={(props) => (
                <input
                  {...props}
                  onKeyDown={handleKeyPress}
                  className={authStyles.otpInput}
                />
              )}
              containerStyle="d-flex justify-content-between"
            />
            <div className="text-center mt-3">
              <Countdown
                key={countdown.key}
                autoStart={true}
                date={countdown.time}
                renderer={renderer}
                onComplete={handleCountdownComplete}
              />
            </div>
            {errorMsg && <p className={authStyles.errorLabel}>{errorMsg}</p>}
          </div>
        </div>

        <div className="mb-3">
          <button
            type="button"
            onClick={handleSubmitOtp}
            disabled={resetLoading || otpCode.length !== 4}
            className={authStyles.submitBtn}
          >
            {(resetLoading && (
              <div
                role="status"
                className="spinner-border text-white"
                style={{ width: "22px", height: "22px" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )) ||
              "Continue"}
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <p className={authStyles.formLabel} style={{ cursor: "default" }}>
            Didn't get the code?
          </p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading || !isCompleted}
            className="border-0 bg-transparent fw-semibold text-primary ms-2"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
