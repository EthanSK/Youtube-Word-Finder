import React from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import constants from "../../../constants"
const { remote } = window.require("electron")

const VideosTextFileButton = () => {
  return (
    <FileChooserButton
      fileChooserType="file"
      onClick={function() {
        let options = constants.fileChooserDefaultOptions
        options.message = "Choose a text file containing the video URLs"
        remote.dialog.showOpenDialogSync(options)
      }}
    />
  )
}

export default VideosTextFileButton
