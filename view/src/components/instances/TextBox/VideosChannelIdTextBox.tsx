import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const VideosChannelIdTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="VideosChannelIdTextBox"
      textBoxId="videosChannelId"
      labelText="Videos channel ID"
      placeholder="Channel ID e.g. UCivXNaaNhyuQQO-0V9L6nFA"
      onFinishEditing={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            channelId: newText
          }
        })
      }}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      initialText={userDefaultsState.channelId}
      isHidden={userDefaultsState.videoSource !== "Channel"}
    />
  )
}

export default VideosChannelIdTextBox
