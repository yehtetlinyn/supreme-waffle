"use client";
import React from "react";
import styles from "../styles/commonStyles.module.css";

import { FaPencil } from "react-icons/fa6";
import { BiDotsVerticalRounded, BiSearchAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiPlus } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ActionMenu = ({
  view,
  edit,
  viewAndEdit,
  deleteMenu,
  createShift,
  createCheckPoint,
  createSop,
  createUser,
  assignPerson,
  excludePerson,
  copyShfitSchedule,
  deleteShiftSchedule,
  siteUser = false,

  editHandler,
  viewHandler,
  deleteHandler,
  assignHandler,
  excludeHandler,
  copyScheduleHandler,
  deleteSchedueHander,
  id,
}) => {
  const pathname = usePathname();
  return (
    <UncontrolledDropdown className={styles.dropdown}>
      <DropdownToggle
        className={styles.dropdownToggle}
        role="button"
        size="sm"
        onClick={(e) => e.stopPropagation()}
      >
        <span>
          <BiDotsVerticalRounded color="#283238" />
        </span>
      </DropdownToggle>
      <DropdownMenu className={`text-right ${styles.dropDownMenu}`}>
        {view && (
          <DropdownItem onClick={viewHandler}>
            <span>
              <BiSearchAlt />
            </span>
            View
          </DropdownItem>
        )}
        {edit && (
          <DropdownItem onClick={editHandler}>
            <span>
              <FaPencil />
            </span>
            Edit
          </DropdownItem>
        )}
        {viewAndEdit && (
          <DropdownItem onClick={viewHandler}>
            <span>
              <BiSearchAlt />
            </span>
            View and Edit
          </DropdownItem>
        )}
        {deleteMenu && (
          <DropdownItem
            onClick={() => {
              deleteHandler();
            }}
          >
            <span>
              <RiDeleteBin6Line />
            </span>
            {siteUser ? "Remove User" : "Delete"}
          </DropdownItem>
        )}
        {createShift && (
          <DropdownItem>
            <Link
              href={{
                pathname: `${pathname}/edit/${id}`,
                query: { tab: "shiftSetting" },
              }}
            >
              <span>
                <HiPlus />
              </span>
              Shift Settings
            </Link>
          </DropdownItem>
        )}
        {createCheckPoint && (
          <DropdownItem>
            <Link
              href={{
                pathname: `${pathname}/edit/${id}`,
                query: { tab: "attendanceCheckpoint" },
              }}
            >
              <span>
                <HiPlus />
              </span>
              Checkpoint Settings
            </Link>
          </DropdownItem>
        )}
        {createSop && (
          <DropdownItem>
            <Link
              href={{
                pathname: `${pathname}/edit/${id}`,
                query: { tab: "sop" },
              }}
            >
              <span>
                <HiPlus />
              </span>
              SOP Settings
            </Link>
          </DropdownItem>
        )}
        {createUser && (
          <DropdownItem>
            <Link
              href={{
                pathname: `${pathname}/edit/${id}`,
                query: { tab: "users" },
              }}
            >
              <span>
                <HiPlus />
              </span>
              User Settings
            </Link>
          </DropdownItem>
        )}
        {assignPerson && (
          <DropdownItem onClick={assignHandler}>Assign Person</DropdownItem>
        )}
        {excludePerson && (
          <DropdownItem onClick={excludeHandler}>Exclude</DropdownItem>
        )}
        {copyShfitSchedule && (
          <DropdownItem onClick={(e) => copyScheduleHandler(e)}>
            <span>
              <FaPencil />
            </span>
            Copy Schedule
          </DropdownItem>
        )}
        {deleteShiftSchedule && (
          <DropdownItem onClick={(e) => deleteSchedueHander(e)}>
            <span>
              <HiPlus />
            </span>
            Delete Schedule
          </DropdownItem>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ActionMenu;
