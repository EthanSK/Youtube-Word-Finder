import React, { useContext } from "react"
import "./FileChooserButton.css"
import folderIcon from "../../../assets/images/folderIcon.png"
import fileIcon from "../../../assets/images/fileIcon.png"
import { ConsoleOutputComponentsPayload } from "../../../reducers/ConsoleOutputReducer"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"

const { remote } = window.require("electron")

const FileChooserButton = (props: {
  fileChooserType: "file" | "folder"
  options: Electron.OpenDialogSyncOptions
  consoleOutputOptions: {
    useDefaultIfUndefined: boolean
    payload?: ConsoleOutputComponentsPayload
  }
  onFilesOrFolderChosen(filePaths?: string[]): void //use for folders too
}) => {
  const { dispatch: consoleOutputDispatch } = useContext(ConsoleOutputContext)

  const image = props.fileChooserType === "file" ? fileIcon : folderIcon
  //doing all this here because every single file and folder chooser will be the same
  async function handleClick() {
    const files = await remote.dialog.showOpenDialog(props.options)
    consoleOutput(files.filePaths)
    props.onFilesOrFolderChosen(files.filePaths)
  }

  function consoleOutput(filePaths?: string[]) {
    let payload = props.consoleOutputOptions.payload
    if (!payload) payload = {}
    if (props.consoleOutputOptions.useDefaultIfUndefined) {
      if (payload.value === undefined && filePaths && filePaths[0])
        payload.value = filePaths[0]
    }
    if (payload.value !== undefined) {
      consoleOutputDispatch({ type: "componentChanged", payload })
    }
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
