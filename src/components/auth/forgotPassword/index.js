"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import authStyles from "@/components/auth/auth.module.css";
import ForgotPwdLogo from "@/assets/icons/forgotPwdLogo";
import ForgotPwdLogoIcon from "@/assets/icons/forgotPwdLogoIcon";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { REQUEST_PASSWORD_OTP } from "@/graphql/mutations/auth";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/utils/validations/auth";

const ForgotPassword = () => {
  const router = useRouter();
  const { loading, error, success, requestOtpInfo, setRequestOtpInfo } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [reqPasswordOtp, { loading: forgotPwdLoading }] = useMutation(
    REQUEST_PASSWORD_OTP,
    {
      client: apolloClient,
      onCompleted(data) {
        const { data: successData, error } = data?.forgotPassword;
        setRequestOtpInfo(successData);
        setErrorMsg(error?.message);
      },
      onError: (error) => {},
    }
  );

  const emailErrMsg = errors.email?.message || errorMsg;
  const authLoading = loading || forgotPwdLoading;

  const handleContactSupportClick = () => {
    const emailSubject = "Tossakan Login problem";
    const emailTo = "tossakan_customersupport.com";
    const emailBody = "";

    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleOnChange = (e) => {
    if (e.target.value) setErrorMsg("");
  };

  const onSubmit = (data) => {
    reqPasswordOtp({ variables: { email: data?.email } });
  };

  useEffect(() => {
    if (requestOtpInfo) router.push("/auth/verifyOtp");
  }, [requestOtpInfo]);

  return (
    <div
      className={`m-0 ${authStyles.bodyContainer}`}
      style={{ padding: "0 5rem 2rem", textAlign: "justify" }}
    >
      <div className={`${authStyles.logo}`}>
        <ForgotPwdLogoIcon />
      </div>
      <div className="d-flex-box align-items-start justify-content-start">
        <h5 className={`${authStyles.header} mt-3 mb-2`}>
          Forgot your password?
        </h5>
        <p className={`${authStyles.subHeader} mb-4`}>
          Enter your email address and you will receive a verification code.
        </p>
      </div>
      <div className="w-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="text"
              id="email"
              {...register("email")}
              onChange={(e) => {
                clearErrors(null);
                handleOnChange(e);
              }}
              placeholder="Enter email"
              className={`${authStyles.inputField} ${
                emailErrMsg ? authStyles.inputError : ""
              }`}
            />
            {emailErrMsg && (
              <p className={authStyles.errorLabel}>{emailErrMsg}</p>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className={`${authStyles.formLabel} pe-none`}>Forgot email?</p>
            <div>
              <button
                type="button"
                onClick={handleContactSupportClick}
                className={`d-inline-block text-decoration-underline link-primary ${authStyles.forgotBtn}`}
              >
                Contact Customer Support
              </button>
            </div>
          </div>
          <div className="mb-3">
            <button
              disabled={authLoading}
              type="submit"
              className={authStyles.submitBtn}
            >
              {(authLoading && (
                <div
                  role="status"
                  className="spinner-border text-white"
                  style={{ width: "22px", height: "22px" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )) ||
                "Get Reset Code"}
            </button>
          </div>
        </form>

        <div className="d-flex mb-4 align-items-center justify-content-center">
          <p className={authStyles.formLabel} style={{ cursor: "default" }}>
            Go Back to
          </p>
          <Link href="/auth/login">
            <button
              type="button"
              className="border-0 bg-transparent fw-semibold text-primary ms-2"
            >
              Login Page
            </button>
            {"."}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
