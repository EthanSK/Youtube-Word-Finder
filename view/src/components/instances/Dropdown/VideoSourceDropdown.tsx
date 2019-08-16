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
  console.log("video source dropdown rerendered") //i honestly don't think it matters that much if the whole ui reloads because of one small change. it's really inexpensive.
  return (
    <DropdownContainer
      key="VideoSourceDropdown"
      onChange={function(event) {
        const value: Values = event.target.value as Values
        let consoleMesage = `Changed source to scan videos to ${value}.`

        switch (value) {
          case Values.Channel:
            userDefaultsDispatch({
              videoSource: "channel"
            })
            consoleMesage += " Ensure you provided a channel ID"
            break
          case Values.Playlist:
            userDefaultsDispatch({
              videoSource: "playlist"
            })
            consoleMesage += " Ensure you provided a playlist ID"
            break
          case Values.TextFile:
            userDefaultsDispatch({
              videoSource: "textFile"
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
            messageType: "userDefault"
          }
        })
      }}
      selectId="videoSource"
      labelText="Video source"
      options={[
        {
          value: Values.Channel,
          isDefaultSelected: userDefaultsState.videoSource === "channel"
        },
        {
          value: Values.Playlist,
          isDefaultSelected: userDefaultsState.videoSource === "playlist"
        },
        {
          value: Values.TextFile,
          isDefaultSelected: userDefaultsState.videoSource === "textFile"
        }
      ]}
    />
  )
}

export default VideoSourceDropdown
