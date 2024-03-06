"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import AuthLogo from "@/assets/icons/authLogo";
import ProsegurLogo from "@/assets/icons/prosegurLogo";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { loginSchema } from "@/utils/validations/auth";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import authStyles from "@/components/auth/auth.module.css";

const Login = () => {
  const router = useRouter();
  const { error, success, loading, authenticate, isAuthenticated } =
    useAuthStore();

  const [isRemembered, setIsRemembered] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    let timeout;

    // if (error) {
    //   toast.error(error);
    //   timeout = setTimeout(() => {
    //     useAuthStore.setState({ error: "" });
    //   }, 3000);
    // }

    if (success && isAuthenticated) {
      toast.success(success);
      timeout = setTimeout(() => {
        useAuthStore.setState({ success: "" });
        router.push("/");
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [success, error, isAuthenticated]);

  const errorMsg = errors.password?.message || error;

  const handleRememberMeChange = (event) => {
    setIsRemembered(event.target.checked);
  };

  const handlePasswordVisibleToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data) => {
    useAuthStore.setState({ error: "" });

    await authenticate({
      identifier: data.identifier,
      password: data.password,
      rememberMe: isRemembered,
    });
  };

  return (
    <div className={authStyles.bodyContainer}>
      <div className={authStyles.logo}>
        <ProsegurLogo />
      </div>
      <h2 className={`${authStyles.header} mb-2`}>Welcome Back</h2>
      <p className={`${authStyles.subHeader} mb-4`}>Login to your account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-100">
        <div className="mb-3">
          <input
            type="text"
            id="identifier"
            {...register("identifier")}
            placeholder="Username or Email"
            className={`${authStyles.inputField} ${
              errors.identifier?.message || error ? authStyles.inputError : ""
            }`}
          />
          {errors.identifier?.message && (
            <p className={authStyles.errorLabel}>{errors.identifier.message}</p>
          )}
        </div>

        <div className="mb-2">
          <div className="position-relative">
            <input
              id="password"
              data-input-type="password"
              placeholder="Password"
              {...register("password")}
              className={`${authStyles.inputField} ${
                errorMsg ? authStyles.inputError : ""
              }`}
              type={(isPasswordVisible && "text") || "password"}
            />
            <button
              type="button"
              onClick={handlePasswordVisibleToggle}
              className={authStyles.passwordToggleBtn}
            >
              {isPasswordVisible ? (
                <BsEye size={20} />
              ) : (
                <BsEyeSlash size={20} />
              )}
            </button>
          </div>
          {errorMsg && <p className={authStyles.errorLabel}>{errorMsg}</p>}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={authStyles.rememberMe}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={isRemembered}
              onChange={handleRememberMeChange}
            />
            <label
              htmlFor="rememberMe"
              className={`ms-2 d-inline-block ${authStyles.formLabel}`}
            >
              Remember me
            </label>
          </div>

          <Link href="/auth/forgotPassword">
            <button type="button" className={authStyles.forgotBtn}>
              Forgot Password ?
            </button>
          </Link>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
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
              "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
