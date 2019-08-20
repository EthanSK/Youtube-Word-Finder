import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ipcSend } from "../../../ipc"

const WordsToFindTextFileButton = () => {
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  let options = constants.fileChooserDefaultOptions
  options.message = "Choose a text file containing the words to find"

  return (
    <FileChooserButton
      fileChooserType="file"
      options={options}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: { name: "Words text file" }
      }}
      onFilesOrFolderChosen={async filePaths => {
        if (filePaths && filePaths[0]) {
          userDefaultsDispatch({
            type: "set",
            payload: { wordsToFindTextFile: filePaths[0] }
          })
        }
      }}
    />
  )
}

export default WordsToFindTextFileButton
