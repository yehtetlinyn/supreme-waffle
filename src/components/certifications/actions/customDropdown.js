import React, { useEffect } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import actionStyles from "./action.module.css";

import iconOptions from "./iconOptions";
import useCertificationsStore from "@/store/certifications";
import { API_URL } from "@/config";
import Image from "next/image";

const CertificateIconDropdown = ({ selectOption, value, disable, icons }) => {
  const { getCertificateIcons, certificateIconsInfo, iconsLoading } =
    useCertificationsStore((state) => state);
  const fetchCertificateIconsData = async () => {
    await getCertificateIcons({
      where: {},
    }).then((data) => selectOption(data[0]));
  };

  useEffect(() => {
    fetchCertificateIconsData();
  }, []);

  if (!iconsLoading) {
    return (
      <UncontrolledDropdown className={actionStyles.dropdown}>
        <DropdownToggle
          role="button"
          caret
          size="sm"
          className={actionStyles.dropdownToggle}
          disabled={disable}
        >
          <Image
            src={value ? value?.url : certificateIconsInfo[0]?.url}
            alt={
              value
                ? value?.alternativeText
                : certificateIconsInfo[0]?.alternativeText
            }
            width={20}
            height={20}
          />
        </DropdownToggle>
        <DropdownMenu className={actionStyles.iconGrid}>
          <div className={actionStyles.gridContainer}>
            {certificateIconsInfo?.map((icon, index) => (
              <DropdownItem
                key={index}
                style={{ padding: 0 }}
                onClick={() => selectOption(icon)}
              >
                <Image
                  src={icon.url}
                  alt={icon.alternativeText}
                  width={20}
                  height={20}
                />
              </DropdownItem>
            ))}
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
};

export default CertificateIconDropdown;
