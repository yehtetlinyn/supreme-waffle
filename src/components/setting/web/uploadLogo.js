"use client";
import React, { useState } from "react";
import brandStyle from "./style.module.css";
import useAgencySettingStore from "@/store/agencySettingStore";
import { FiCamera } from "react-icons/fi";
import { API_URL } from "@/config";
const UploadLogo = ({ setSmallLogoFile, setLargeLogoFile }) => {
  const [previewSmallLogo, setPreviewSmallLogo] = useState("");
  const [previewLargeLogo, setPreviewLargeLogo] = useState("");
  const { smallLogo, setSmallLogo, largeLogo, setLargeLogo } =
    useAgencySettingStore((state) => ({
      smallLogo: state.smallLogo,
      setSmallLogo: state.setSmallLogo,
      largeLogo: state.largeLogo,
      setLargeLogo: state.setLargeLogo,
    }));
  const handleFileSelect = (logoType, event) => {
    const file = event.target.files[0];

    const url = URL.createObjectURL(file);
    if (logoType === "smallLogo") {
      setPreviewSmallLogo(url);
      setSmallLogoFile(event.target.files[0]);
    }
    if (logoType === "largeLogo") {
      setPreviewLargeLogo(url);
      setLargeLogoFile(event.target.files[0]);
    }
  };
  return (
    <section className="mt-3">
      <div className="mb-4">
        <p className={brandStyle.footerText}>
          Small Logo{" "}
          <span className={brandStyle.optionText}>
            (Recommended: 40x40px PNG with transparent background)
          </span>
        </p>
        <div className={brandStyle.imageBox}>
          <label htmlFor="file" className={brandStyle.uploadIcon}>
            {!smallLogo && !previewSmallLogo && <FiCamera />}
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => handleFileSelect("smallLogo", e)}
            className={brandStyle.imageInput}
          />
          {(smallLogo || previewSmallLogo) && (
            <img
              src={previewSmallLogo || `${API_URL}${smallLogo}`}
              alt="uploaded"
              width={150}
              height={80}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <button
          onClick={() => {
            setPreviewSmallLogo(null);
            setSmallLogo(null);
          }}
          className={brandStyle.imageRemoveBtn}
        >
          Remove
        </button>
      </div>
      <div className="mb-4">
        <p className={brandStyle.footerText}>
          Large Logo{" "}
          <span className={brandStyle.optionText}>
            (Recommended: 40x40px PNG with transparent background)
          </span>
        </p>
        <div className={brandStyle.imageBox}>
          <label htmlFor="file" className={brandStyle.uploadIcon}>
            {!largeLogo && !previewLargeLogo && <FiCamera />}
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => handleFileSelect("largeLogo", e)}
            className={brandStyle.imageInput}
          />
          {(largeLogo || previewLargeLogo) && (
            <img
              src={previewLargeLogo || `${API_URL}${largeLogo}`}
              alt="uploaded"
              width={150}
              height={80}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <button
          onClick={() => {
            setPreviewLargeLogo(null);
            setLargeLogo(null);
          }}
          className={brandStyle.imageRemoveBtn}
        >
          Remove
        </button>
      </div>
    </section>
  );
};

export default UploadLogo;
