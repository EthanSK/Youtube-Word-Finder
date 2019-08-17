import React from "react"
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
const { remote } = window.require("electron")

const VideosTextFileButton = () => {
  return (
    <FileChooserButton
      fileChooserType="file"
      onClick={function() {
        remote.dialog.showOpenDialog({ properties: ["openFile"] })
      }}
    />
  )
}

export default VideosTextFileButton
