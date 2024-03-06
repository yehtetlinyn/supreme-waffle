import React, { useEffect, useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import styles from "./assignUser.module.css";
import commonStyles from "../../styles/commonStyles.module.css";
import Image from "next/image";

const AssignUsersDropdown = ({ profiles, value, onChange }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(profiles);
  }, [profiles]);

  const handleSearchChange = (searchInput) => {
    searchInput
      ? setFilteredData(
          profiles.filter(
            (item) =>
              item.fullName
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()) ||
              item.user.email?.toLowerCase().includes(searchInput.toLowerCase())
          )
        )
      : setFilteredData(profiles);
  };

  const handleItemClick = (profile) => {
    console.log(value?.filter((e) => e.id === profile.id));
    const include =
      value?.filter((e) => e.id === profile.id).length > 0 ? true : false;
    if (include) {
      return value?.filter((e) => e.id != profile.id);
    } else {
      return [...value, profile];
    }
  };

  return (
    <UncontrolledDropdown className={styles.customDropdown}>
      <DropdownToggle caret className={styles.customDropdownToggle}>
        {value?.length === 0 && <span>Select team members</span>}
        {value?.slice(0, 4).map((user, index) => (
          <Image
            key={index}
            src={
              user.photo?.url ||
              "/images/blank-profile-picture-geede3862d_1280.png"
            }
            alt="profile-picture"
            width={15}
            height={15}
            style={{ backgroundSize: "cover" }}
          />
        ))}
        {value?.length > 4 && (
          <div className={styles.plusMore}>{`${value?.length - 4}+`}</div>
        )}
      </DropdownToggle>
      <DropdownMenu className={styles.customDropdownMenu}>
        <input
          type="text"
          placeholder="Search name here"
          className="search-input"
          // value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
        <div style={{ maxHeight: 250, overflow: "auto" }}>
          {filteredData?.map((profile, index) => (
            <DropdownItem
              key={index}
              onClick={() => onChange(handleItemClick(profile))}
              toggle={false}
            >
              <input
                type="checkbox"
                className={commonStyles.smallCheckbox}
                checked={value?.filter((user) => user.id === profile.id).length}
                onChange={() => {}}
              />
              <Image
                src={
                  profile.photo?.url ||
                  "/images/blank-profile-picture-geede3862d_1280.png"
                }
                alt="profile-picture"
                width={15}
                height={15}
                style={{ backgroundSize: "cover" }}
              />
              <div className={styles.dropdownProfile}>
                <span>{profile.fullName}</span>
                <sup>{profile.user.email}</sup>
              </div>
            </DropdownItem>
          ))}
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default AssignUsersDropdown;
