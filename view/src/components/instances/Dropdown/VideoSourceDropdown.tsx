import React, { useContext } from "react"
import DropdownContainer from "../../elements/Dropdown/Dropdown"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

export type VideoSource = "Channel" | "Playlist" | "Text file" //enums suck complete dick. getting reference erro cannot acces enum before initialization. WTF IS ENUM INITIALIZATION!!!! ITS A TYPE

const VideoSourceDropdown = (props: {
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <DropdownContainer
      key="VideoSourceDropdown"
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      onChange={function(event) {
        const value: VideoSource = event.target.value as VideoSource
        userDefaultsDispatch({
          type: "set",
          payload: {
            videoSource: value
          }
        })
      }}
      selectId="videoSource"
      labelText="Video source"
      options={[
        {
          value: "Channel",
          isSelected: userDefaultsState.videoSource === "Channel",
          instructionConsoleOutput: "Ensure you provided a channel ID"
        },
        {
          value: "Playlist",
          isSelected: userDefaultsState.videoSource === "Playlist",
          instructionConsoleOutput:
            "Ensure you provided a playlist ID that is public"
        },
        {
          value: "Text file",
          isSelected: userDefaultsState.videoSource === "Text file",
          instructionConsoleOutput:
            "Ensure you provided a text file with each video URL on a new line"
        }
      ]}
    />
  )
}

export default VideoSourceDropdown
