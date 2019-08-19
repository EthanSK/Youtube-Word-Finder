import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import VideosTextFileButton from "../FileChooserButton/VideosTextFileChooser"

const VideosTextFileTextBox = (props: { key: string }) => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="VideosTextFileTextBox"
      textBoxId="textFileVideoSource"
      labelText="Videos text file"
      fileChooser={<VideosTextFileButton />}
      placeholder="Text file containing the videos"
      initialText={userDefaultsState.videoTextFile}
      isHidden={userDefaultsState.videoSource !== "Text file"}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
    />
  )
}

export default VideosTextFileTextBox
