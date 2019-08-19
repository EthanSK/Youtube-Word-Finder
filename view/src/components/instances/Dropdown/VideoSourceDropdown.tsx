import React, { useContext } from "react"
import DropdownContainer from "../../elements/Dropdown/Dropdown"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"

enum Values {
  Channel = "Channel",
  Playlist = "Playlist",
  TextFile = "Text File"
}

const VideoSourceDropdown = (props: {
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  const { dispatch: consoleOutputDispatch } = useContext(ConsoleOutputContext)
  return (
    <DropdownContainer
      key="VideoSourceDropdown"
      onChange={function(event) {
        const value: Values = event.target.value as Values
        let consoleMesage = `Changed source to scan videos to ${value}.`

        switch (value) {
          case Values.Channel:
            userDefaultsDispatch({
              type: "set",
              payload: {
                videoSource: "channel"
              }
            })
            consoleMesage += " Ensure you provided a channel ID"
            break
          case Values.Playlist:
            userDefaultsDispatch({
              type: "set",
              payload: {
                videoSource: "playlist"
              }
            })
            consoleMesage += " Ensure you provided a playlist ID that is public"
            break
          case Values.TextFile:
            userDefaultsDispatch({
              type: "set",
              payload: {
                videoSource: "textFile"
              }
            })
            consoleMesage +=
              " Ensure you provided a text file with each video URL on a new line"
            break
          default:
            break
        }
        consoleOutputDispatch({
          type: "addNewMessage",
          payload: {
            message: consoleMesage,
            messageType: "settings"
          }
        })
      }}
      selectId="videoSource"
      labelText="Video source"
      options={[
        {
          value: Values.Channel,
          isSelected: userDefaultsState.videoSource === "channel"
        },
        {
          value: Values.Playlist,
          isSelected: userDefaultsState.videoSource === "playlist"
        },
        {
          value: Values.TextFile,
          isSelected: userDefaultsState.videoSource === "textFile"
        }
      ]}
    />
  )
}

export default VideoSourceDropdown
