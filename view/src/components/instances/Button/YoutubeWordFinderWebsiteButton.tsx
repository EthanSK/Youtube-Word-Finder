import React from "react"
import etggamesIcon from "../../../assets/images/youtubewordfindericon.png"
import { ipcSend } from "../../../ipc"

const YoutubeWordFinderWebsiteButton = () => {
  function handleButtonClick() {
    ipcSend("open-url-browser", "https://www.youtubewordfinder.com")
  }
  return (
    <button id="etggamesButton" onClick={handleButtonClick}>
      <img src={etggamesIcon} id="etggamesImage" alt="ETGgames logo"></img>
    </button>
  )
}
//styling done in button.css
export default YoutubeWordFinderWebsiteButton
