import React, { useContext } from "react"
import DropdownContainer from "../../elements/Dropdown/Dropdown"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

enum Values {
  Channel = "Channel",
  Playlist = "Playlist",
  TextFile = "TextFile"
}

const VideoSourceDropdown = (props: {
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  console.log("video source dropdown rerendered") //i honestly don't think it matters that much if the whole ui reloads because of one small change. it's really inexpensive.
  return (
    <DropdownContainer
      key="VideoSourceDropdown"
      onChange={function(event) {
        const value: Values = event.target.value as Values
        switch (value) {
          case Values.Channel:
            userDefaultsDispatch({
              videoSourceState: "channel"
            })
            break
          case Values.Playlist:
            userDefaultsDispatch({
              videoSourceState: "playlist"
            })
            break
          case Values.TextFile:
            userDefaultsDispatch({
              videoSourceState: "textFile"
            })
            break
          default:
            break
        }
      }}
      selectId="videoSource"
      labelText="Video source"
      options={[
        {
          value: Values.Channel,
          isDefaultSelected: userDefaultsState.videoSourceState === "channel"
        },
        {
          value: Values.Playlist,
          isDefaultSelected: userDefaultsState.videoSourceState === "playlist"
        },
        {
          value: Values.TextFile,
          isDefaultSelected: userDefaultsState.videoSourceState === "textFile"
        }
      ]}
    />
  )
}

export default VideoSourceDropdown
