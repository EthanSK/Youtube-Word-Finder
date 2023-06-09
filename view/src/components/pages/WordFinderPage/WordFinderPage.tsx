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

interface DownloadingClip {
  clip: ClipToDownload
  clipIndex: number
  didFinishDownload: boolean
  downloadPath?: string
}

const WordFinderPage = () => {
  const [windowData, setWindowData] = useState<WordFinderRequestWindowData>({
    word: {
      mainWord: "Loading...",
      originalUnfilteredWord: "Loading...",
    },
    arrIndex: 0,
  })
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  const [clips, setClips] = useState<ClipToDownload[]>([])
  const [isError, setIsError] = useState(false)
  const [curClipIndex, setCurClipIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [scannedVidsCount, setScannedVidsCount] = useState(0)
  const [isFinishedScanning, setIsFinishedScanning] = useState(false)
  const [downloadingClips, setDownloadingClips] = useState<DownloadingClip[]>(
    []
  )
  const [didStopAtClipEnd, setDidStopAtClipEnd] = useState(false)

  const [isVideoURLExpiredError, setIsVideoURLExpiredError] = useState(false)
  let playerRef = useRef<ReactPlayer>(null)

  function getCurrentDownloadingClip(): DownloadingClip | undefined {
    return downloadingClips.filter((el) => el.clipIndex === curClipIndex)[0]
  }

  function setCurrentDownloadingClip(newValue: DownloadingClip) {
    setDownloadingClips((downloadingClips) => {
      const curClips = downloadingClips
      let curClip = curClips.filter((el) => el.clipIndex === curClipIndex)[0]
      //if already exits, modify props
      // console.log("new value", newValue)
      if (curClip) {
        curClip.clip = newValue.clip
        curClip.didFinishDownload = newValue.didFinishDownload
        curClip.downloadPath = newValue.downloadPath
        //these are the only things that can change

        return [...downloadingClips]
      } else {
        return [...downloadingClips, newValue]
      }
    })
  }

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

  // useEffect(() => {

  // }, [downloadingClips])

  //reload on curclipindex change
  useEffect(() => {
    watchClipAgain()
  }, [curClipIndex])

  useEffect(() => {
    // console.log("send reque to restore defaults")
    ipcSend("request-word-finder-data", { shouldGetUpdated: false }) //sending it here so it only requests when ready
    const channel = "response-word-finder-data-batch"
    var handleUserDefaultRestore = function (
      event: Electron.IpcRendererEvent,
      data: WordFinderResponseWindowData
    ) {
      setWindowData({ word: data.word, arrIndex: data.arrIndex })

      setClips((clips) => [...clips, ...data.clips]) //must be callback or it wont work
      if (data.isError) {
        setIsError(true)
      }
      if (data.didScanNewVideo) {
        setScannedVidsCount((scannedVidsCount) => scannedVidsCount + 1)
      }
    }

    ipcRenderer.on(channel, handleUserDefaultRestore) //called multiple times with new data

    ipcRenderer.once(
      "response-word-finder-data-batch-finished",
      (event, data) => {
        // setCurClipIndex(curClipIndex => mod(curClipIndex, clips.length)) //make sure the clip index is valid if we just cleared and redownloaded. this causes weird bugs
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
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!,
        "seconds"
      )
    //   setIsPlaying(true)
  }

  //checks to stop interval
  useInterval(() => {
    if (!clips[curClipIndex]) return

    const endTime = timesWithPadding({
      originalEnd: clips[curClipIndex].end,
    }).end
    const adjustedEndTime = endTime //&& endTime - 0.35 //because ffmpeg seems to cut short/youtube player cuts long //ah fuck it its not worth it...makes like no difference

    if (
      playerRef.current &&
      adjustedEndTime &&
      playerRef.current.getCurrentTime() > adjustedEndTime &&
      !didStopAtClipEnd
    ) {
      // console.log("is playing? ", isPlaying)

      if (isPlaying) {
        // console.log("pausing")
        setIsPlaying(false)
        setDidStopAtClipEnd(true) //so we can keep playing after clip endsn
      }
    }
  }, 1)

  function getURL() {
    if (clips[curClipIndex]) {
      // console.log("clip word length: ", clips.length)
      // console.log("clip cur id : ", clips[curClipIndex].id)
      return constants.youtubeVideoURLPrefix + clips[curClipIndex].id
    }
  }

  function handleReloadClicked() {
    watchClipAgain()
  }
  function watchClipAgain() {
    playerRef.current &&
      clips[curClipIndex] &&
      playerRef.current.seekTo(
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!,
        "seconds"
      )
    setDidStopAtClipEnd(false)
    setIsPlaying(true)
  }

  function handleNextClicked() {
    setCurClipIndex((curClipIndex) => mod(curClipIndex + 1, clips.length))
    //reload handled in useeffect
  }
  function handlePreviousClicked() {
    setCurClipIndex((curClipIndex) => mod(curClipIndex - 1, clips.length))
  }

  function handleDownloadClicked() {
    const downloadingClip = getCurrentDownloadingClip()
    if (downloadingClip && !downloadingClip.didFinishDownload) return
    if (clips.length === 0) return
    const clipPkg: ClipToDownloadIPCPkg = {
      clip: clips[curClipIndex],
      index: curClipIndex,
    }
    if (downloadingClip && downloadingClip.didFinishDownload) {
      ipcSend("go-to-file-path", downloadingClip.downloadPath) //open in finder
      return
    }
    ipcSend("download-manually-found-word", clipPkg)
    setCurrentDownloadingClip({
      clip: clips[curClipIndex],
      clipIndex: curClipIndex,
      didFinishDownload: false,
    })
    const indexOfThisClip = curClipIndex //so if we change the index, the copy won't change

    const channel = "downloaded-manually-found-word"
    var handleDownloadedWord = function (
      event: Electron.IpcRendererEvent,
      data: ResponseClipToDownloadIPCPkg
    ) {
      if (indexOfThisClip !== data.index) return
      if (data.isVideoURLExpiredError) {
        console.log("video url expired")
        const data: WordFinderRequestWindowData = windowData
        ipcSend("reopen-window-url-expired", data)

        // setIsVideoURLExpiredError(true)
        // setClips([])
        // setIsFinishedScanning(true)

        // ipcSend("request-word-finder-data", { shouldGetUpdated: true })

        //on get new data, set clip index to     setCurClipIndex(curClipIndex => mod(curClipIndex, clips.length)) so the new index is defo valid

        return
      }
      if (data.isError) {
        setIsError(true)
        return
      }
      const path = data.downloadPath
      const clip: DownloadingClip = {
        clip: clips[data.index],
        clipIndex: data.index,
        didFinishDownload: true,
        downloadPath: path,
      }
      // console.log("download clip: ", clip, "path", path)

      setCurrentDownloadingClip(clip)
      ipcRenderer.removeListener(channel, handleDownloadedWord) //only remove the listener if the event was for the correct index
    }

    ipcRenderer.on(channel, handleDownloadedWord)
  }

  const playerStyle = {
    margin: "auto",
  }

  const errorMessageStyle = {
    color: "red",
  }

  function setText() {
    //when any vars in this function change, and are hooked into, component will rerender
    let text = ""
    if (clips[curClipIndex]) {
      text += `Clip found for word: ${clips[curClipIndex].wordSearchedText} ${
        clips[curClipIndex].isAlternative
          ? `(alternative for ${clips[curClipIndex].mainWord})`
          : ""
      }`
    } else {
      if (isFinishedScanning) {
        text += `Could not find clip for word ${windowData.word.mainWord} or alternatives. Scanned ${scannedVidsCount} videos. `
      } else {
        text += `Trying to find clip for word ${windowData.word.mainWord} or alternatives... `
      }
    }

    return text
  }

  function setText2() {
    let text = ""
    if (clips[curClipIndex]) {
      text = `${
        clips.length - 1
      } other clips found. Scanned ${scannedVidsCount} videos. `
    } else if (isFinishedScanning) {
      text = `Try increasing max number of vids & add more alternative words. `
    } else {
      text = `Scanned ${scannedVidsCount} videos. `
    }

    text += `Clip index: ${curClipIndex}. `

    if (clips[curClipIndex]) {
      text += `Clip length: ${(
        timesWithPadding({ originalEnd: clips[curClipIndex].end }).end! -
        timesWithPadding({ originalStart: clips[curClipIndex].start }).start!
      ).toFixed(2)} seconds. `
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
        controls={true}
        playing={isPlaying}
        width={640}
        height={360}
        style={playerStyle}
        ref={playerRef}
        onReady={handlePlayerOnReady}
        onStart={handlePlayerOnStart}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
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
          title={(function () {
            const downloadingClip = getCurrentDownloadingClip()
            if (downloadingClip) {
              return downloadingClip.didFinishDownload
                ? "Go to clip file"
                : "Downloading..."
            } else {
              return "Download clip"
            }
          })()}
          extraClasses="wordFinderControlButton"
          onClick={handleDownloadClicked}
        />
      </div>
      <p>{setText()}</p>
      <p>{setText2()}</p>
      <p className="miniText">
        {(function () {
          const downloadingClip = getCurrentDownloadingClip()
          // console.log("thingy: ", downloadingClip)
          if (downloadingClip) {
            return downloadingClip.didFinishDownload
              ? `Clip is downloaded at: ${downloadingClip.downloadPath}`
              : `Downloading clip...`
          } else {
            return ""
          }
        })()}
      </p>
      <p className="errorMessage" style={errorMessageStyle}>
        {(function () {
          if (isVideoURLExpiredError) {
            return "Raw video URL expired. Redownloading updated metadata for all videos."
          } else if (isError) {
            return "An error occurred. Check console for more info."
          } else {
            return ""
          }
        })()}
      </p>
    </div>
  )
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export default WordFinderPage
