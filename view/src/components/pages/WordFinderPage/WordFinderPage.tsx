import React, { useEffect, useState } from "react"
// import YouTubePlayer from "react-player/lib/players/YouTube"
import ReactPlayer from "react-player"

import "./WordFinderPage.css"
import { ipcSend } from "../../../ipc"
import constants from "../../../constants"
const { ipcRenderer } = window.require("electron")

const WordFinderPage = () => {
  const [windowData, setWindowData] = useState<WordFinderRequestWindowData>({
    word: {
      mainWord: "Loading...",
      originalUnfilteredWord: "Loading..."
    },
    arrIndex: 0
  })

  const [clips, setClips] = useState<ClipToDownload[]>([])
  const [isError, setIsError] = useState(false)
  const [intervalHandle, setIntervalHandle] = useState<NodeJS.Timeout>()
  const [curClipIndex, setCurClipIndex] = useState(0)
  let playerRef: ReactPlayer | null
  useEffect(() => {
    // console.log("send reque to restore defaults")
    ipcSend("request-word-finder-data", {}) //sending it here so it only requests when ready
    const channel = "response-word-finder-data-batch"
    var handleUserDefaultRestore = function(
      event: Electron.IpcRendererEvent,
      data: WordFinderResponseWindowData
    ) {
      setWindowData({ word: data.word, arrIndex: data.arrIndex })
      setClips([...clips, ...data.clips])
      if (data.isError) {
        setIsError(true)
      }
      console.log("set window data: ", windowData)
    }

    ipcRenderer.on(channel, handleUserDefaultRestore) //called multiple times with new data

    return () => {
      if (intervalHandle) clearInterval(intervalHandle)
      ipcRenderer.removeListener(channel, handleUserDefaultRestore)
    }
  }, [])

  function handlePlayerOnReady() {
    console.log("handlePlayerOnReady")
    playerRef && playerRef.seekTo(clips[curClipIndex].start)
    checkToStopVideo()
  }
  function handlePlayerOnStart() {
    playerRef && playerRef.seekTo(clips[curClipIndex].start)
  }

  function checkToStopVideo() {
    // setIntervalHandle(
    //   setInterval(() => {
    //     playerRef && console.log("secs played: ", playerRef.getCurrentTime())
    //   }, 100)
    // )
  }

  function getURL() {
    // console.log("get url,", clips[curClipIndex] && clips[curClipIndex].id)
    // return "https://www.youtube.com/watch?v=ERBVFcutl3M"
    if (clips[curClipIndex])
      return constants.youtubeVideoURLPrefix + clips[curClipIndex].id
  }

  const playerStyle = {
    margin: "auto"
  }

  const errorMessageStyle = {
    color: "red"
  }
  return (
    <div id="wordFinderPageId">
      <ReactPlayer
        url={getURL()}
        playing={true}
        width={640}
        height={360}
        style={playerStyle}
        ref={player => {
          playerRef = player
        }}
        onReady={handlePlayerOnReady}
        onStart={handlePlayerOnStart}
        onProgress={() => console.log("handling on progress")}
      ></ReactPlayer>
      <p>Word: {windowData.word.mainWord}</p>
      <p className="errorMessage" style={errorMessageStyle}>
        {(function() {
          return isError
            ? "An error occurred. Check console for more info."
            : ""
        })()}
      </p>
    </div>
  )
}

export default WordFinderPage
