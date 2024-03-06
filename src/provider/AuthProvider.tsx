"use client";
import { useEffect, ReactNode } from "react";
import useAuthStore from "@/store/authStore";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getSession } = useAuthStore();

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      await getSession();
    };

    getAuthenticatedUser();
  }, []);

  return children;
};

export default AuthProvider;
