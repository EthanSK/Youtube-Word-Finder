import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const CustomYtdlBinary = () => {
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  let options = {
    ...constants.fileChooserDefaultOptions,
    filters: [
      {
        name: "All Files",
        extensions: ["*"],
      },
    ],
  }
  options.message =
    "Choose a text file containing the cookies you exported from your browser"

  return (
    <FileChooserButton
      fileChooserType="file"
      options={options}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: { name: "Custom youtube-dl binary" },
      }}
      onFilesOrFolderChosen={async (filePaths) => {
        if (filePaths && filePaths[0]) {
          userDefaultsDispatch({
            type: "set",
            payload: { customYtdlBinary: filePaths[0] },
          })
        }
      }}
    />
  )
}

export default CustomYtdlBinary
