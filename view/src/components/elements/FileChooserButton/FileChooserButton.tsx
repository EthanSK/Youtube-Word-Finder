import React from "react"
import "./FileChooserButton.css"
import folderIcon from "../../../assets/images/folderIcon.png"
import fileIcon from "../../../assets/images/fileIcon.png"

const FileChooserButton = (props: {
  fileChooserType: "file" | "folder"
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}) => {
  const image = props.fileChooserType === "file" ? fileIcon : folderIcon
  return (
    <button
      className="fileChooserButton"
      onClick={event => {
        props.onClick(event)
      }}
    >
      <img
        src={image}
        className="folderIcon fileIcon"
        alt={props.fileChooserType + " icon"}
      />
    </button>
  )
}

export default FileChooserButton
