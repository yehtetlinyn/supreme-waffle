import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import React, { ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import AuthProvider from "@/provider/AuthProvider";
import ToastProvider from "@/provider/ToastProvider";

const openSan = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Super Fine",
  description: "Super Fine Web Portal",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={openSan.className}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
