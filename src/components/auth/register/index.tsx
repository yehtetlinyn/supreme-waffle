"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { loginSchema } from "@/utils/validations/auth";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import authStyles from "@/components/auth/auth.module.css";
import PageLogo from "@/assets/icons/pageLogo";

const Register = () => {
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
    let timeout: any;

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

  const handlePasswordVisibleToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: any) => {
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
        <PageLogo />
      </div>
      <h2 className={`${authStyles.header} mb-2`}>Member Registeration</h2>
      <p className={`${authStyles.subHeader} mb-4`}>Create New account</p>
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

        <div className="mb-3">
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
              "Register"}
          </button>
        </div>

        <div className="d-flex mt-4 align-items-center justify-content-center">
          <p className={authStyles.formLabel} style={{ cursor: "default" }}>
            Already A Member?
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
      </form>
    </div>
  );
};

export default Register;
