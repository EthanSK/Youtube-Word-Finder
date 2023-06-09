import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const VideosChannelIdTextBox = (props: { key: string }) => {
  const { state: userDefaultsState, dispatch: userDefaultsDispatch } =
    useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="VideosChannelIdTextBox"
      textBoxId="videosChannelId"
      labelText="Videos channel URL"
      placeholder="Channel URL e.g. https://www.youtube.com/@REEEthan"
      onFinishEditing={function (event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            channelUrl: newText,
          },
        })
      }}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      initialText={userDefaultsState.channelUrl}
      isHidden={userDefaultsState.videoSource !== "Channel"}
    />
  )
}

export default VideosChannelIdTextBox
