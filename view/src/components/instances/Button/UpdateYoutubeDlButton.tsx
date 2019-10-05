import React from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"

const UpdateYoutubeDlButton = () => {
  return (
    <Button
      title="Update youtube-dl"
      class="smallButton"
      onClick={event => {
        ipcSend("update-youtube-dl", {})
      }}
    />
  )
}
export default UpdateYoutubeDlButton
