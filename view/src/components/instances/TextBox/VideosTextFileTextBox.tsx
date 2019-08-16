import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const VideosTextFileTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="VideosTextFileTextBox"
      textBoxId="textFileVideoSource"
      labelText="Videos"
      fileChooserType="file"
      placeholder="Text file containing the videos"
      onFinishEditing={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          videoTextFile: newText
        })
      }}
      initialText={userDefaultsState.videoTextFile}
      isHidden={userDefaultsState.videoSource !== "textFile"}
    />
  )
}

export default VideosTextFileTextBox
