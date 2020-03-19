import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const CookiesTextFile = () => {
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  let options = { ...constants.fileChooserDefaultOptions }
  options.message =
    "Choose a text file containing the cookies you exported from your browser"

  return (
    <FileChooserButton
      fileChooserType="file"
      options={options}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: { name: "Cookies text file" }
      }}
      onFilesOrFolderChosen={async filePaths => {
        if (filePaths && filePaths[0]) {
          userDefaultsDispatch({
            type: "set",
            payload: { cookiesTextFile: filePaths[0] }
          })
        }
      }}
    />
  )
}

export default CookiesTextFile
