import React, { useContext } from "react"
import DropdownContainer from "../elements/Dropdown/Dropdown"
import { UserDefaultsContext } from "../../contexts/UserDefaultsContext"

enum Values {
  Channel = "Channel",
  Playlist = "Playlist",
  TextFile = "TextFile"
}

const VideoSourceDropdown = () => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <DropdownContainer
      key="videoSource"
      onChange={function(event) {
        const value: Values = event.target.value as Values
        console.log("on change detected", value)
        switch (value) {
          case Values.Channel:
            userDefaultsDispatch({
              type: { videoSourceAction: "useChannelState" }
            })
            break
          case Values.Playlist:
            userDefaultsDispatch({
              type: { videoSourceAction: "usePlaylistState" }
            })
            break
          case Values.TextFile:
            userDefaultsDispatch({
              type: { videoSourceAction: "useTextFileState" }
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
