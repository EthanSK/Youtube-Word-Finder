import React from "react"
import etggamesIcon from "../../../assets/images/etggamesIcon.png"
import { ipcSend } from "../../../ipc"

const ETGgamesButton = () => {
  function handleButtonClick() {
    ipcSend("open-url-browser", "https://www.etggames.com")
  }
  return (
    <button id="etggamesButton" onClick={handleButtonClick}>
      <img src={etggamesIcon} id="etggamesImage" alt="ETGgames logo"></img>
    </button>
  )
}
//styling done in button.css
export default ETGgamesButton
