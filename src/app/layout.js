import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Open_Sans } from "next/font/google";

import Script from "next/script";

import AuthProvider from "@/provider/AuthProvider";
import ToastProvider from "@/provider/ToastProvider";

const openSan = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Tossakan Web Portal",
  description: "Tossakan Web Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSan.className}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
      <Script
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.markerConfig = {
              destination: '64d470519409ce36f14d593a',
              source: 'snippet'
            };
          
          
         !function(e,r,a){if(!e.__Marker){e.__Marker={};var t=[],n={__cs:t};["show","hide","isVisible","capture","cancelCapture","unload","reload","isExtensionInstalled","setReporter","setCustomData","on","off"].forEach(function(e){n[e]=function(){var r=Array.prototype.slice.call(arguments);r.unshift(e),t.push(r)}}),e.Marker=n;var s=r.createElement("script");s.async=1,s.src="https://edge.marker.io/latest/shim.js";var i=r.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}}(window,document); 
          `,
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
    </html>
  );
}
