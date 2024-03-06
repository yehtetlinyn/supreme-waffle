"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ResetPwdLogo from "@/assets/icons/resetPwdLogo";
import ResetPwdLogoIcon from "@/assets/icons/resetPwdLogoIcon";
import authStyles from "@/components/auth/auth.module.css";
import StrengthBar from "@/components/base/strengthBar";
import SessionSuccessModal from "@/components/modals/session";
import { API_URL } from "@/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { RESET_PASSWORD } from "@/graphql/mutations/auth";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/utils/validations/auth";
import { useForm } from "react-hook-form";

const GRAPHQL_URL = `${API_URL}/graphql`;

const ResetPassword = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const router = useRouter();

  const {
    loading,
    verifyOtpInfo,
    resetOtpInfo,
    setResetOtpInfo,
    resetOtpStates,
  } = useAuthStore();

  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({ resetPwd: false });
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const handlePasswordVisible = (name) => {
    setVisibility({ ...visibility, [name]: !visibility[name] });
  };

  const handleOnChange = (e) => {
    if (e.target.value) setErrorMsg("");
  };

  const handleRedirectLogin = () => {
    resetOtpStates();
    router.push("/auth/login");
  };

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;
    const { jwt: token, code: otpCode } = verifyOtpInfo;

    const client = new ApolloClient({
      uri: GRAPHQL_URL,
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: new InMemoryCache(),
    });
    const { data: submitData } = await client.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        optCode: otpCode,
        password: password,
        confirmPassword: confirmPassword,
      },
    });

    setResetOtpInfo(submitData?.resetPassword);
    setErrorMsg(submitData?.resetPassword?.error?.message);
  };

  const resetPwdErrMsg = errors.password?.message || errorMsg;

  useEffect(() => {
    if (resetOtpInfo?.reset) {
      setIsModalOpen((prevModalOpen) => ({
        ...prevModalOpen,
        resetPwd: true,
      }));
    }
  }, [resetOtpInfo?.reset]);

  useEffect(() => {
    if (!verifyOtpInfo) router.push("/auth/login");
  }, [verifyOtpInfo]);

  return (
    <div
      className={`m-0 ${authStyles.bodyContainer}`}
      style={{ padding: "0 5rem" }}
    >
      <div className={`${authStyles.logo}`}>
        <ResetPwdLogoIcon />
      </div>
      <h5 className={`${authStyles.header} mb-2 align-self-start`}>
        Create New Password
      </h5>
      <p className={`${authStyles.subHeader} mb-4 align-self-start`}>
        Enter new password
      </p>
      <div className="w-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <div className="position-relative">
              <input
                id="password"
                {...register("password")}
                data-input-type="password"
                placeholder="Password"
                className={`${authStyles.inputField}`}
                onChange={(e) => handleOnChange(e)}
                type={visibility["password"] ? "text" : "password"}
              />
              <button
                type="button"
                className={authStyles.passwordToggleBtn}
                onClick={() => handlePasswordVisible("password")}
              >
                {visibility["password"] ? (
                  <BsEye size={20} />
                ) : (
                  <BsEyeSlash size={20} />
                )}
              </button>
            </div>
            {getValues(["password"]) && (
              <div className="mt-1">
                <StrengthBar password={getValues(["password"])} />
              </div>
            )}
            {resetPwdErrMsg && (
              <p className={`m-0 p-0 ${authStyles.errorLabel}`}>
                {resetPwdErrMsg}
              </p>
            )}
          </div>
          <div className={authStyles.passwordHintContent}>
            <p className="mb-0" style={{ textAlign: "justify" }}>
              MUST CONTAIN:
            </p>
            <ul style={{ textAlign: "justify" }}>
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter [A-Z]</li>
              <li>Maximum two identical letters in a row</li>
              <li>At least one number [0-9]</li>
              <li>At least one lowercase letter [a-z]</li>
              <li>At least one special character, e.g., ! * % ^ & # @ ]</li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="position-relative">
              <input
                id="confirm_password"
                name="confirmPassword"
                {...register("confirmPassword")}
                data-input-type="password"
                placeholder="Confirm password"
                className={`${authStyles.inputField}`}
                type={visibility["confirmPassword"] ? "text" : "password"}
              />
              <button
                type="button"
                className={authStyles.passwordToggleBtn}
                onClick={() => handlePasswordVisible("confirmPassword")}
              >
                {visibility["confirmPassword"] ? (
                  <BsEye size={20} />
                ) : (
                  <BsEyeSlash size={20} />
                )}
              </button>
            </div>
            {getValues(["confirmPassword"]) && (
              <div className="mt-1">
                <StrengthBar password={getValues(["confirmPassword"])} />
              </div>
            )}
            {errors.confirmPassword && (
              <p className={`m-0 p-0 ${authStyles.errorLabel}`}>
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <button
              disabled={loading}
              type="submit"
              className={authStyles.submitBtn}
            >
              {(loading && (
                <div
                  role="status"
                  className="spinner-border text-white"
                  style={{ width: "22px", height: "22px" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )) ||
                "Submit"}
            </button>
          </div>
        </form>
      </div>
      <div className="d-flex mb-4 align-items-start justify-content-start">
        <p className={authStyles.formLabel} style={{ cursor: "default" }}>
          Go Back to
        </p>
        <Link href="/auth/login">
          <button
            onClick={() => resetOtpStates()}
            className="border-0 bg-transparent fw-semibold text-primary ms-2"
          >
            Login Page
          </button>
          {"."}
        </Link>
      </div>

      <SessionSuccessModal
        enableRootToggle={false}
        open={isModalOpen.resetPwd}
        toggle={() => setIsModalOpen({ resetPwd: false })}
        title={"Password Reset Complete"}
        bodyValue={
          <div>
            <p className="d-flex align-items-center justify-content-center">
              Password reset successfully
            </p>
            <p>Back to sign in with your updated password.</p>
          </div>
        }
        actionBtnProps="Back To Sigin"
        handleClick={handleRedirectLogin}
      />
    </div>
  );
};

export default ResetPassword;
