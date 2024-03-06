import React, { useEffect, useState } from "react";
import { Button, UncontrolledPopover } from "reactstrap";
import styles from "./assignedUsers.module.css";
import { AiOutlineSearch } from "react-icons/ai";

const AddUsers = ({ isOpen, toggle, otherUsers, addUserHandler }) => {
  const [openSearchBox, setOpenSearchBox] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(otherUsers);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setFilteredUsers(otherUsers);
    setSelectedUsers([]);
  }, [otherUsers]);

  useEffect(() => {}, []);

  const onSearchChange = (search) => {
    setSearchInput(search);
    search
      ? setFilteredUsers(
          otherUsers?.filter(
            (user) =>
              user.attributes.fullName.toLowerCase().includes(search) ||
              user.attributes.user.data?.attributes.email
                .toLowerCase()
                .includes(search)
          )
        )
      : setFilteredUsers(otherUsers);
  };

  const handleItemClick = (item) => {
    selectedUsers.includes(item)
      ? setSelectedUsers(selectedUsers.filter((i) => i != item))
      : setSelectedUsers([...selectedUsers, item]);
  };

  const handleMouseLeave = () => {
    setOpenSearchBox(false);
  };

  return (
    <UncontrolledPopover
      isOpen={isOpen}
      toggle={toggle}
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
        {filteredUsers?.map((user) => (
          <label className={styles.popoverListItem}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user)}
              onChange={() => handleItemClick(user)}
            />
            <img
              src={
                user?.attributes.photo.data?.attributes.url ||
                "/images/blank-profile-picture-geede3862d_1280.png"
              }
              alt="Image"
            />
            <div>
              <span>{user.attributes.fullName}</span>
              <sup>{user.attributes.user.data?.attributes.email}</sup>
            </div>
          </label>
        ))}
      </div>

      <div className={styles.popoverBtnContainer}>
        <Button
          className={styles.cancelBtn}
          onClick={() => {
            setSelectedUsers([]);
            toggle();
          }}
        >
          Cancel
        </Button>
        <Button
          className={styles.addBtn}
          onClick={() => {
            addUserHandler(selectedUsers);
          }}
        >
          Add
        </Button>
      </div>
    </UncontrolledPopover>
  );
};

export default AddUsers;
