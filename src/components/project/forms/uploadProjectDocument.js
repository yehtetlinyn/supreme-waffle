import React from "react";
import { useDropzone } from "react-dropzone";

import styles from "../project.module.css";

import { SlCloudUpload } from "react-icons/sl";
import { RiDeleteBinLine } from "react-icons/ri";
import { useParams, useSearchParams } from "next/navigation";
import { AiOutlineFileText } from "react-icons/ai";
import { FaDownload } from "react-icons/fa6";

const UploadProjectDocument = ({ onChange, value }) => {
  const params = useParams();
  const viewMode = params.action === "view";
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: false,
    disabled: viewMode,
    onDrop: (acceptedFiles) => {
      // Pass the selected files to the onChange function
      onChange(acceptedFiles[0]);
    },
  });

  const clearFile = () => {
    onChange(null);
  };

  return (
    <>
      {!value && (
        <div {...getRootProps({ className: styles.uploadDocContainer })}>
          <input {...getInputProps()} />
          <SlCloudUpload size={50} />
          <p>Drag and Drop file here</p>
          <button type="button" onClick={open}>
            Browse File
          </button>
        </div>
      )}
      {value && (
        <div className={styles.uploadedFileCard}>
          <AiOutlineFileText />
          {value.name}
          {viewMode ? (
            <FaDownload
              style={{ color: "var(--primary-green)", marginLeft: "auto" }}
            />
          ) : (
            <RiDeleteBinLine
              onClick={clearFile}
              style={{ color: "red", marginLeft: "auto" }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UploadProjectDocument;
