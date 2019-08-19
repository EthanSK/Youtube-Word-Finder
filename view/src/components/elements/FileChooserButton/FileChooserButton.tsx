import React, { useContext } from "react"
import "./FileChooserButton.css"
import folderIcon from "../../../assets/images/folderIcon.png"
import fileIcon from "../../../assets/images/fileIcon.png"

const { remote } = window.require("electron")

const FileChooserButton = (props: {
  fileChooserType: "file" | "folder"
  options: Electron.OpenDialogSyncOptions
  onFilesOrFolderChosen(filePaths?: string[]): void //use for folders too
}) => {
  const image = props.fileChooserType === "file" ? fileIcon : folderIcon
  //doing all this here because every single file and folder chooser will be the same
  async function handleClick() {
    const files = await remote.dialog.showOpenDialog(props.options)
    props.onFilesOrFolderChosen(files.filePaths)
  }

  return (
    <button className="fileChooserButton" onClick={handleClick}>
      <img
        src={image}
        className="folderIcon fileIcon"
        alt={props.fileChooserType + " icon"}
      />
    </button>
  )
}

export default FileChooserButton
