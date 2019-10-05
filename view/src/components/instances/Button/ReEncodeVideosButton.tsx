import React, { useContext } from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"

const ReEncodeVideosButton = () => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  const { dispatch: consoleOutputDispatch } = useContext(ConsoleOutputContext)

  return (
    <Button
      title={`Re-encode videos: ${
        userDefaultsState.reEncodeVideos === false ? "off" : "on"
      }`}
      class="smallButton"
      onClick={event => {
        const newValue = !(userDefaultsState.reEncodeVideos === false
          ? false
          : true)

        if (newValue === false) {
          consoleOutputDispatch({
            type: "addNewMessage",
            payload: {
              message:
                "Will not re-encode videos after downloading them, and will copy the codec of the source. The download may be slightly faster, but there may be some bugs with the video, such as a frozen last frame for a few seconds",
              messageType: "info"
            }
          })
        } else {
          consoleOutputDispatch({
            type: "addNewMessage",
            payload: {
              message:
                "Will re-encode videos after downloading them. The download may be slightly slower, but will probably not have any issues or bugs",
              messageType: "info"
            }
          })
        }

        userDefaultsDispatch({
          type: "set",
          payload: { reEncodeVideos: newValue }
        })
        ipcSend("re-encode-videos", newValue)
      }}
    />
  )
}
export default ReEncodeVideosButton
