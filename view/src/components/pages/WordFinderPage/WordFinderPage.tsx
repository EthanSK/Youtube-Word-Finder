import React, { useEffect, useState, useContext, useRef } from "react"
// import YouTubePlayer from "react-player/lib/players/YouTube"
import ReactPlayer from "react-player"
import useInterval from "../../../utils/useInterval"

import "./WordFinderPage.css"
import { ipcSend } from "../../../ipc"
import constants from "../../../constants"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import Button from "../../elements/Button/Button"
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
  const [curClipIndex, setCurClipIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [scannedVidsCount, setScannedVidsCount] = useState(0)
  const [isFinishedScanning, setIsFinishedScanning] = useState(false)

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

  //reload on curclipindex change
  useEffect(() => {
    reload()
  }, [curClipIndex])

  useEffect(() => {
    // console.log("send reque to restore defaults")
    ipcSend("request-word-finder-data", {}) //sending it here so it only requests when ready
    const channel = "response-word-finder-data-batch"
    var handleUserDefaultRestore = function(
      event: Electron.IpcRendererEvent,
      data: WordFinderResponseWindowData
    ) {
      setWindowData({ word: data.word, arrIndex: data.arrIndex })

      setClips(clips => [...clips, ...data.clips]) //must be callback or it wont work
      if (data.isError) {
        setIsError(true)
      }
      if (data.didScanNewVideo) {
        setScannedVidsCount(scannedVidsCount => scannedVidsCount + 1)
      }
    }

    ipcRenderer.on(channel, handleUserDefaultRestore) //called multiple times with new data

    ipcRenderer.once(
      "response-word-finder-data-batch-finished",
      (event, data) => {
        setIsFinishedScanning(true)
      }
    )

    return () => {
      ipcRenderer.removeListener(channel, handleUserDefaultRestore)
    }
  }, [])

  function handlePlayerOnReady() {}
  function handlePlayerOnStart() {
    playerRef.current &&
      playerRef.current.seekTo(
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!
      )
    //   setIsPlaying(true)
  }

  //checks to stop interval
  useInterval(() => {
    if (!clips[curClipIndex]) return
    const endTime = timesWithPadding({
      originalEnd: clips[curClipIndex].end
    }).end
    if (
      playerRef.current &&
      endTime &&
      playerRef.current.getCurrentTime() > endTime
    ) {
      // console.log("is playing? ", isPlaying)

      if (isPlaying) {
        // console.log("pausing")
        setIsPlaying(false)
      }
    }
  }, 50)

  function getURL() {
    if (clips[curClipIndex]) {
      // console.log("clip word length: ", clips.length)
      console.log("clip cur id : ", clips[curClipIndex].id)
      return constants.youtubeVideoURLPrefix + clips[curClipIndex].id
    }
  }

  function handleReloadClicked() {
    reload()
  }
  function reload() {
    playerRef.current &&
      clips[curClipIndex] &&
      playerRef.current.seekTo(
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!
      )
    setIsPlaying(true)
  }

  function handleNextClicked() {
    setCurClipIndex(curClipIndex => mod(curClipIndex + 1, clips.length))
    //reload handled in useeffect
  }
  function handlePreviousClicked() {
    setCurClipIndex(curClipIndex => mod(curClipIndex - 1, clips.length))
  }
  function handleDownloadClicked() {
    ipcSend("download-manually-found-word", clips[curClipIndex]!)
    ipcRenderer.once("downloaded-manually-found-word", (event, data) => {
      const path = data.downloadPath
      console.log("download clip: ", path)
    })
  }

  const playerStyle = {
    margin: "auto"
  }

  const errorMessageStyle = {
    color: "red"
  }

  function setText() {
    //when any vars in this function change, and are hooked into, component will rerender
    let text = ""
    if (clips[curClipIndex]) {
      text = `Clip found for word: ${clips[curClipIndex].wordSearchedText} `
    } else {
      if (isFinishedScanning) {
        text = `Could not find clip for word ${windowData.word.mainWord} or alternatives. Scanned ${scannedVidsCount} videos. `
      } else {
        text = `Trying to find clip for word ${windowData.word.mainWord} or alternatives. `
      }
    }

    return text
  }

  function setText2() {
    let text = ""
    if (clips[curClipIndex]) {
      text = `${clips.length -
        1} other clips found. Scanned ${scannedVidsCount} videos. `
    } else if (isFinishedScanning) {
      text = `Try increasing max number of vids & add more alternative words. `
    } else {
      text = `Scanned ${scannedVidsCount} videos. `
    }
    if (isFinishedScanning) {
      text += "Scan complete. "
    }

    return text
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
      />
      <div id="wordFinderControls">
        <Button
          class="mediumButton"
          title="Previous clip"
          extraClasses="wordFinderControlButton"
          onClick={handlePreviousClicked}
        />
        <Button
          class="mediumButton"
          title="Next clip"
          extraClasses="wordFinderControlButton"
          onClick={handleNextClicked}
        />
        <Button
          class="mediumButton"
          extraClasses="reloadButton wordFinderControlButton"
          title="Watch clip again"
          onClick={handleReloadClicked}
        />
        <Button
          class="mediumButton"
          title="Download clip"
          extraClasses="wordFinderControlButton"
          onClick={handleDownloadClicked}
        />
      </div>
      <p>{setText()}</p>
      <p>{setText2()}</p>
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

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export default WordFinderPage
