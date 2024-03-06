import React, { useEffect, useState } from "react";
import { Button, UncontrolledPopover } from "reactstrap";
import styles from "@/components/positions/assignedusers/assignedUsers.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import useSiteUserStore from "@/store/siteUserStore";
import Image from "next/image";
import commonStyles from "@/components/styles/commonStyles.module.css";

const AddUsers = (props) => {
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const notAssignedUserData = useSiteUserStore(
    (state) => state.notAssignedUserData
  );

  const [filterdUsers, setFilteredUsers] = useState([]);

  const onSearchChange = (search) => {
    setSearchInput(search);
    search
      ? setFilteredUsers(
          notAssignedUserData.filter(
            (user) =>
              user.attributes.fullName.toLowerCase().includes(search) ||
              user.attributes.user.data?.attributes.email
                .toLowerCase()
                .includes(search)
          )
        )
      : setFilteredUsers(notAssignedUserData);
  };

  const handleItemClick = (item) => {
    selectedUsers.includes(item)
      ? setSelectedUsers(selectedUsers.filter((i) => i != item))
      : setSelectedUsers([...selectedUsers, item]);
  };

  const handleMouseLeave = () => {
    setOpenSearchBox(false);
  };

  useEffect(() => {
    setFilteredUsers(notAssignedUserData);
    setSelectedUsers([]);
  }, [notAssignedUserData]);
  return (
    <UncontrolledPopover
      isOpen={props.isAddUserPopoverOpen}
      placement="bottom-end"
      target="addButton"
      trigger="legacy"
      hideArrow
      popperClassName={styles.customPopover}
      innerClassName={styles.innerPopover}
    >
      <div className={styles.popoverHeader} onMouseLeave={handleMouseLeave}>
        {(openSearchBox && (
          <div className={styles.searchContainer}>
            <AiOutlineSearch className={styles.searchInputIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search name or email"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )) || (
          <>
            {"Add New Users"}
            <AiOutlineSearch
              onClick={() => setOpenSearchBox(true)}
              className={styles.searchBtn}
            />
          </>
        )}
      </div>
      <div className={styles.popoverList}>
        {filterdUsers?.map((user, index) => (
          <label className={styles.popoverListItem} key={index}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user)}
              onChange={() => handleItemClick(user)}
            />

            {user?.attributes?.photo?.data ? (
              <>
                <Image
                  src={`${user?.attributes?.photo?.data?.attributes.url}`}
                  alt="Image"
                  width={40}
                  height={40}
                />
              </>
            ) : (
              <Image
                src="/images/blank-profile-picture-geede3862d_1280.png"
                alt="no"
                width={40}
                height={40}
                className={commonStyles.image}
              />
            )}

            <div>
              <span>{user?.attributes?.fullName}</span>
              <sup>{user?.attributes?.user?.data?.attributes?.email}</sup>
            </div>
          </label>
        ))}
      </div>

      <div className={styles.popoverBtnContainer}>
        <button
          className={styles.cancelBtn}
          onClick={() => {
            setSelectedUsers([]);
            props.togglePopoverHandler();
          }}
        >
          Cancel
        </button>
        <button
          className={
            selectedUsers?.length === 0 ? styles.disabledAddBtn : styles.addBtn
          }
          disabled={selectedUsers?.length === 0}
          onClick={() => {
            if (selectedUsers?.length > 0) {
              props.addUserHandler(selectedUsers);
            }
          }}
        >
          Add
        </button>
      </div>
    </UncontrolledPopover>
  );
};

export default AddUsers;
