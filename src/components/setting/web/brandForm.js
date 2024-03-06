"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import brandStyle from "./style.module.css";
import { PrimaryBtn } from "@/components/base/primaryBtn";
import { SecondaryBtn } from "@/components/base/secondaryBtn";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCircleInfo } from "react-icons/fa6";
import useAgencySettingStore from "@/store/agencySettingStore";
import { UPDATE_AGENCY_SETTING } from "@/graphql/mutations/agencySettings";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { uploadFile } from "@/utils/helpers";
import UploadLogo from "./uploadLogo";
import ColorPalette from "./colorPalette";

const BrandForm = () => {
  const appTheme =
    typeof window !== "undefined" && localStorage.getItem("tossakan-app-theme");

  const [flag, setFlag] = useState(false);
  const [smallLogoFile, setSmallLogoFile] = useState(null);
  const [largeLogoFile, setLargeLogoFile] = useState(null);
  const [themeInStorage, setThemeInStorage] = useState();
  const {
    theme,
    selectedTheme,
    backgroundColor,
    primaryColor,
    secondaryColor,
    tableColor,
    textColor,
    buttonColor,
    footerNotes,
    setFooterNotes,
    handleChangeTheme,
    setSelectedTheme,
  } = useAgencySettingStore((state) => ({
    theme: state.theme,
    selectedTheme: state.selectedTheme,
    backgroundColor: state.backgroundColor,
    primaryColor: state.primaryColor,
    secondaryColor: state.secondaryColor,
    buttonColor: state.buttonColor,
    tableColor: state.tableColor,
    textColor: state.textColor,
    footerNotes: state.footerNotes,
    setFooterNotes: state.setFooterNotes,
    handleChangeTheme: state.handleChangeTheme,
    setSelectedTheme: state.setSelectedTheme,
  }));

  console.log("themeInStorage", themeInStorage);
  const [updateAgencySetting] = useMutation(UPDATE_AGENCY_SETTING, {
    client: apolloClient,
    onCompleted: (data) => {
      setFlag(false);
      setSelectedTheme(
        data?.updateAgencySetting?.data?.attributes?.activateTheme?.themeOptions
          ?.name
      );
      localStorage.setItem(
        "tossakan-app-theme",
        JSON.stringify(
          data?.updateAgencySetting?.data?.attributes?.activateTheme
            ?.themeOptions?.name
        )
      );
      setSmallLogoFile(null);
      setLargeLogoFile(null);
    },
    onError: (error) => console.log(error),
  });
  const handleApplyTheme = async (defaultTheme) => {
    let smallLogoFieldId = null;
    let largeLogoFieldId = null;
    const updatedData = {
      activateTheme: {
        themeOptions: {
          name: defaultTheme === "tossakan" ? defaultTheme : theme,
          palette: {
            text: {
              hint: textColor?.hint,
              primary: textColor?.primary,
              warning: textColor?.warning,
              secondary: textColor?.secondary,
            },
            table: {
              background: tableColor?.background,
              selectedRow: tableColor?.selectedRow,
            },
            button: {
              main: buttonColor?.main,
              contrastText: buttonColor?.contrastText,
            },
            primary: {
              main: primaryColor?.main,
            },
            secondary: {
              main: secondaryColor?.main,
            },
            background: {
              card: backgroundColor?.card,
              default: backgroundColor?.default,
              sidebar: backgroundColor?.sidebar,
            },
          },
        },
      },
      footerNotes,
    };
    setFlag(true);
    if (smallLogoFile) {
      smallLogoFieldId = await uploadFile(smallLogoFile);
    }
    if (largeLogoFile) {
      largeLogoFieldId = await uploadFile(largeLogoFile);
    }

    if (!!smallLogoFieldId || !!largeLogoFieldId) {
      updatedData.logo = {
        SmallSize: smallLogoFieldId,
        LargeSize: largeLogoFieldId,
      };
    }
    await updateAgencySetting({
      variables: {
        data: updatedData,
      },
    });
  };

  const handleResetTheme = async () => {
    const theme = await handleChangeTheme("tossakan");
    await handleApplyTheme(theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    if (selectedTheme === "custom-theme" || themeInStorage === "custom-theme") {
      document.documentElement.style.setProperty(
        "--text-hint",
        textColor?.hint
      );
      document.documentElement.style.setProperty(
        "--text-warning",
        textColor?.warning
      );
      document.documentElement.style.setProperty(
        "--text-primary",
        textColor?.primary
      );
      document.documentElement.style.setProperty(
        "--text-secondary",
        textColor?.secondary
      );
      document.documentElement.style.setProperty(
        "--table-bg",
        tableColor?.background
      );
      document.documentElement.style.setProperty(
        "--table-selected-row",
        tableColor?.selectedRow
      );
      document.documentElement.style.setProperty(
        "--button-main",
        buttonColor?.main
      );
      document.documentElement.style.setProperty(
        "--button-contrast-text",
        buttonColor?.contrastText
      );
      document.documentElement.style.setProperty(
        "--primary-main",
        primaryColor?.main
      );
      document.documentElement.style.setProperty(
        "--secondary-main",
        secondaryColor?.main
      );
      document.documentElement.style.setProperty(
        "--card-bg",
        backgroundColor?.card
      );
      document.documentElement.style.setProperty(
        "--default-bg",
        backgroundColor?.default
      );
      document.documentElement.style.setProperty(
        "--sidebar-bg",
        backgroundColor?.sidebar
      );
    } else {
      document.documentElement.removeAttribute("style");
    }
  }, [selectedTheme, flag, themeInStorage]);
  useEffect(() => {
    localStorage.setItem("tossakan-app-theme", JSON.stringify(selectedTheme));
  }, [selectedTheme]);

  useEffect(() => {
    appTheme !== undefined || appTheme
      ? setThemeInStorage(JSON.parse(appTheme))
      : setThemeInStorage("tossakan");
  }, []);
  return (
    <>
      <Card className={brandStyle.card}>
        <CardBody>
          <h4 className={brandStyle.title}>Add your own branding</h4>
          <UploadLogo
            setLargeLogoFile={setLargeLogoFile}
            setSmallLogoFile={setSmallLogoFile}
          />
          <div className={brandStyle.brandStyleContainer}>
            <p className={brandStyle.title}>Color Palette</p>
            <ColorPalette />
            <section className="my-5">
              <h4 className={brandStyle.title}>Theme Color </h4>
              <div className="d-flex gap-3 text-center mt-3">
                <div className="d-flex flex-column">
                  <button
                    className={brandStyle.themeBtn}
                    style={{ backgroundColor: "#ffd000" }}
                    onClick={() => handleChangeTheme("tossakan")}
                  ></button>
                  <label className={brandStyle.label}>Tossakan</label>
                </div>
                <div className="d-flex flex-column">
                  <button
                    className={brandStyle.themeBtn}
                    style={{ backgroundColor: "#13547A" }}
                    onClick={() => handleChangeTheme("nexstack")}
                  ></button>
                  <label className={brandStyle.label}>NexStack</label>
                </div>
                <div className="d-flex flex-column">
                  <button
                    className={brandStyle.themeBtn}
                    style={{ backgroundColor: "#FFD000" }}
                    onClick={() => handleChangeTheme("prosegur")}
                  ></button>
                  <label className={brandStyle.label}>Prosegur</label>
                </div>
              </div>
            </section>
            <section>
              <h4 className={brandStyle.title}>Footer Notes</h4>
              <div className="d-flex gap-2 mt-2 mb-2">
                <label>Please enter custom note below</label>

                <p className={brandStyle.footerText}>
                  {!footerNotes || footerNotes?.length === 0 ? (
                    <span className={brandStyle.warningText}>
                      (Maximum of 200 characters)
                    </span>
                  ) : footerNotes?.length < 200 ? (
                    <span className={brandStyle.warningText}>
                      (Maximum of 200 characters - {200 - footerNotes?.length}{" "}
                      characters left)
                    </span>
                  ) : (
                    <p className={brandStyle.warningText}>
                      <FaCircleInfo />
                      <span className="ms-2">
                        Cannot exceed more than 200 Characters
                      </span>
                    </p>
                  )}
                </p>
              </div>

              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="footer-notes"
                  style={{ padding: "0.75rem" }}
                >
                  ©
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Security App 2013, 2023. All rights reserved"
                  aria-label="footer-notes"
                  aria-describedby="footer-notes"
                  value={footerNotes}
                  onChange={setFooterNotes}
                />
              </div>
            </section>
            <div className={brandStyle.btnWrapper}>
              <SecondaryBtn handleClick={handleResetTheme} label="Reset" />
              <PrimaryBtn handleClick={handleApplyTheme} label="Apply Style" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default BrandForm;
