import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const VideosPlaylistIdTextBox = (props: { key: string }) => {
  const { state: userDefaultsState, dispatch: userDefaultsDispatch } =
    useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="VideosPlaylistIdTextBox"
      textBoxId="videosPlaylistId"
      labelText="Videos playlist URL"
      placeholder="Playlist URL e.g. https://www.youtube.com/playlist?list=PLRcWcsa00Z7RW_ule-9-woT0wQxCkwVGB"
      onFinishEditing={function (event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            playlistUrl: newText,
          },
        })
      }}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      initialText={userDefaultsState.playlistUrl}
      isHidden={userDefaultsState.videoSource !== "Playlist"}
    />
  )
}

export default VideosPlaylistIdTextBox
