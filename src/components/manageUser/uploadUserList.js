import React, { useMemo, useRef, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import { SlCloudUpload } from "react-icons/sl";
import Link from "next/link";
import { FaFileZipper } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { uploadUserZip } from "@/utils/helpers";

const UploadUserList = ({
  setCurrentTab,
  setUploadedUsers,
  zipFileContent,
  setZipFileContent,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFolderChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setZipFileContent(file);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    !zipFileContent && setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleOnDragOver = (event) => {
    event.preventDefault();
  };

  const [message, setMessage] = useState();
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const importedFile = event.dataTransfer.files[0];
    if (importedFile && !zipFileContent) {
      const fileType = importedFile["type"];
      const validFileTypes = ["application/x-zip-compressed"];

      if (validFileTypes.includes(fileType)) {
        setZipFileContent(importedFile);
      } else {
        setMessage("only zip file accepted");
      }
    }
  };

  const clearImportedFile = () => {
    setZipFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async () => {
    const userList = await uploadUserZip(zipFileContent);
    setUploadedUsers(userList);
    setCurrentTab(2);
  };

  return (
    <div className={styles.uploadUserListContainer}>
      <div className={styles.uploadUserContent}>
        <div
          className={styles.importFilesContainer}
          style={zipFileContent && { opacity: "0.5" }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleOnDragOver}
        >
          <SlCloudUpload size={50} />
          <span>Drag and drop your file here</span>
          <span>OR</span>
          <div className={styles.fileImportBtn}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".zip"
              disabled={zipFileContent}
              onChange={handleFolderChange}
            />
            Browse Files
          </div>
        </div>
        {zipFileContent && (
          <div className={styles.importedFileCard}>
            <FaFileZipper size={40} color="var(--primary-yellow)" />
            <div>
              <span style={{ color: "var(--primary-font)", display: "block" }}>
                {zipFileContent?.name}
              </span>
              <span style={{ color: "var(--medium-gray)" }}>
                {`${(zipFileContent?.size / 1000000).toFixed(2)} MB`}
              </span>
            </div>
            <RiDeleteBin6Line
              size={20}
              color="red"
              style={{ marginLeft: "auto" }}
              onClick={clearImportedFile}
            />
          </div>
        )}
      </div>

      <div className={styles.actionButtonContainer}>
        <Link href="/settings/manageUsers">
          <button className={commonStyles.formCancelBtn}>Cancel</button>
        </Link>
        <button
          className={
            zipFileContent ? commonStyles.browseBtn : commonStyles.disabledBtn
          }
          style={{ marginLeft: "auto" }}
          disabled={!zipFileContent}
          onClick={submit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UploadUserList;
