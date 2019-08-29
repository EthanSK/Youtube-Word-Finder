import React, { useEffect, useState } from "react"
// import YouTubePlayer from "react-player/lib/players/YouTube"
import ReactPlayer from "react-player"

import "./WordFinderPage.css"
import { ipcSend } from "../../../ipc"
const { ipcRenderer } = window.require("electron")

const WordFinderPage = () => {
  const [windowData, setWindowData] = useState<WordFinderResponseWindowData>({
    word: {
      mainWord: "Loading...",
      originalUnfilteredWord: "Loading..."
    },
    arrIndex: 0,
    clips: []
  })
  let playerRef: ReactPlayer | null
  let interval: NodeJS.Timeout
  useEffect(() => {
    // console.log("send reque to restore defaults")
    ipcSend("request-word-finder-data", {}) //sending it here so it only requests when ready
    const channel = "response-word-finder-data"
    var handleUserDefaultRestore = function(
      event: Electron.IpcRendererEvent,
      data: WordFinderResponseWindowData
    ) {
      setWindowData(data)
      // console.log("set window data: ", data)
    }

    ipcRenderer.once(channel, handleUserDefaultRestore) //one time thing

    return () => {
      clearInterval(interval)
    }
  }, [])

  function handlePlayerOnReady() {
    playerRef && playerRef.seekTo(30)
    checkToStopVideo()
  }
  function handlePlayerOnStart() {
    // playerRef && playerRef.seekTo(20)
  }

  function checkToStopVideo() {
    // interval = setInterval(() => {
    //   console.log("secs played: ", playerRef!.getCurrentTime())
    // }, 100)
  }

  const playerStyle = {
    margin: "auto"
  }
  return (
    <div id="wordFinderPageId">
      {/* <ReactPlayer
        url="https://www.youtube.com/watch?v=ERBVFcutl3M"
        playing={false}
        width={640}
        height={360}
        style={playerStyle}
        ref={player => {
          playerRef = player
        }}
        onReady={handlePlayerOnReady}
        onStart={handlePlayerOnStart}
        onProgress={() => console.log("handling on progress")}
      ></ReactPlayer> */}
      <p>Word: {windowData.word.mainWord}</p>
    </div>
  )
}

export default WordFinderPage
