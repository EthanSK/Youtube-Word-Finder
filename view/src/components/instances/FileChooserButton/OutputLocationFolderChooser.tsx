import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const OutputLocationFolderButton = () => {
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  let options = { ...constants.folderChooserDefaultOptions }
  options.message = "Choose a folder to store output files"

  return (
    <FileChooserButton
      fileChooserType="folder"
      options={options}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: { name: "Output folder location" }
      }}
      onFilesOrFolderChosen={async filePaths => {
        if (filePaths && filePaths[0]) {
          userDefaultsDispatch({
            type: "set",
            payload: { outputLocation: filePaths[0] }
          })
        }
      }}
    />
  )
}

export default OutputLocationFolderButton
