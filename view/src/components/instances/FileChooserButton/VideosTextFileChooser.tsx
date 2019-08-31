import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const VideosTextFileButton = () => {
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  let options = { ...constants.fileChooserDefaultOptions }
  options.message = "Choose a text file containing the video URLs"

  return (
    <FileChooserButton
      fileChooserType="file"
      options={options}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: { name: "Videos text file" }
      }}
      onFilesOrFolderChosen={async filePaths => {
        if (filePaths && filePaths[0]) {
          userDefaultsDispatch({
            type: "set",
            payload: { videoTextFile: filePaths[0] }
          })
        }
      }}
    />
  )
}

export default VideosTextFileButton
