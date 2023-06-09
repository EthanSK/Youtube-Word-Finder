import React from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"
import { ipcRenderer } from "electron"

const UpdateYoutubeDlButton = () => {
  return (
    <Button
      title="Update youtube-dl (yt-dlp)"
      class="smallButton"
      onClick={(event) => {
        ipcSend("update-youtube-dl", {})
      }}
    />
  )
}
export default UpdateYoutubeDlButton
