import React, { useContext } from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
const { remote } = window.require("electron")

const VideosTextFileButton = () => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  return (
    <FileChooserButton
      fileChooserType="file"
      onClick={async function() {
        let options = constants.fileChooserDefaultOptions
        options.message = "Choose a text file containing the video URLs"
        const file = await remote.dialog.showOpenDialog(options)
        // console.log("file: ", file.filePaths)
        if (file.filePaths && file.filePaths[0]) {
          userDefaultsDispatch({ videoTextFile: file.filePaths[0] })
        }
      }}
    />
  )
}

export default VideosTextFileButton
