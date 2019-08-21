import React from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"

const WordOptionsButton = () => {
  return (
    <Button
      title="Open Word Options"
      class="mediumButton"
      onClick={event => {
        ipcSend("open-word-options", {})
      }}
    />
  )
}
export default WordOptionsButton