import React, { useContext } from "react"
import "./FileChooserButton.css"

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
    <button className="emojiButton fileChooserButton" onClick={handleClick}>
      {/* <img
        src={image}
        className="folderIcon fileIcon"
        alt={props.fileChooserType + " icon"}
      /> */}
      {(function() {
        if (props.fileChooserType === "file") return "📄"
        if (props.fileChooserType === "folder") return "📂"
      })()}
    </button>
  )
}

export default FileChooserButton
