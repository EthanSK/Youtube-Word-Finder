import React, { useEffect, useState, useContext, useRef } from "react"
// import YouTubePlayer from "react-player/lib/players/YouTube"
import ReactPlayer from "react-player"

import "./WordFinderPage.css"
import { ipcSend } from "../../../ipc"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
const { ipcRenderer } = window.require("electron")

const WordFinderPage = () => {
  const [windowData, setWindowData] = useState<WordFinderRequestWindowData>({
    word: {
      mainWord: "Loading...",
      originalUnfilteredWord: "Loading..."
    },
    arrIndex: 0
  })
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  const [clips, setClips] = useState<ClipToDownload[]>([])
  const [isError, setIsError] = useState(false)
  const [intervalHandle, setIntervalHandle] = useState<NodeJS.Timeout>()
  const [curClipIndex, setCurClipIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  let playerRef = useRef<ReactPlayer>(null)

  function timesWithPadding(times: {
    originalStart?: number
    originalEnd?: number
  }): { start?: number; end?: number } {
    let start = times.originalStart
    let end = times.originalEnd
    if (userDefaultsState.paddingToAdd) {
      start && (start = Math.max(start - userDefaultsState.paddingToAdd, 0))
      end && (end = end + userDefaultsState.paddingToAdd) //if -to is longer than vid, it just stops at end which is fine
    }
    return { start, end }
  }

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
    // console.log("handlePlayerOnReady")
    // playerRef &&
    //   playerRef.seekTo(timesWithPadding(clips[curClipIndex].start).start!)
    // checkToStopVideo()
  }
  function handlePlayerOnStart() {
    playerRef.current &&
      playerRef.current.seekTo(
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!
      )
    checkToStopVideo()
  }

  function checkToStopVideo() {
    setIntervalHandle(
      setInterval(() => {
        const endTime = timesWithPadding({
          originalEnd: clips[curClipIndex].end
        }).end
        // console.log(
        //   "cur: ",
        //   playerRef.current && playerRef.current.getCurrentTime(),
        //   "end",
        //   clips[curClipIndex],
        //   endTime
        // )

        if (
          playerRef.current &&
          endTime &&
          playerRef.current.getCurrentTime() > endTime
        ) {
          setIsPlaying(false)
        }
      }, 100)
    )
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
        playing={isPlaying}
        width={640}
        height={360}
        style={playerStyle}
        ref={playerRef}
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
