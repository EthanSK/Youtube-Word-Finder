import React from "react"
import "./FileChooserButton.css"
import folderIcon from "../../../assets/images/folderIcon.png"
import fileIcon from "../../../assets/images/fileIcon.png"

const FileChooserButton = (props: { fileChooserType: "file" | "folder" }) => {
  const image = props.fileChooserType === "file" ? fileIcon : folderIcon
  return (
    <button className="fileChooserButton">
      <img
        src={image}
        className="folderIcon fileIcon"
        alt={props.fileChooserType + " icon"}
      />
    </button>
  )
}

export default FileChooserButton
