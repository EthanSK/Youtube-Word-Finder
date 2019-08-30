import { ipcMain } from "electron"
import { handleNewWordsTextFile } from "./words"
import { save, load } from "./store"
import { cleanupDirs } from "./filesystem"

export const userDefaultsKey = "userDefaults"

//it's better to just copy and paste the state interface that define a type union of keys, because we'll end up finding the full types useful in the main process code

ipcMain.on("save-user-default", (event, data: UserDefaultsState) => {
  saveUserDefault(data)
  if (data && data.wordsToFindTextFile) handleNewWordsTextFile()
  if (
    data &&
    (data.videoSource ||
      data.videoTextFile ||
      data.playlistId ||
      data.channelId)
  ) {
    cleanupDirs(true)
  } //if we change the video source, delete the cached metadata
})

ipcMain.on("restore-user-defaults", (event, data) => {
  setUserDefaultsInitialValuesIfNeeded()
  event.sender.send("restored-user-defaults", load(userDefaultsKey))
})

function setUserDefaultsInitialValuesIfNeeded() {
  function setIfNeeded(userDefaults: UserDefaultsState) {
    for (const key in userDefaults) {
      const keyTyped: keyof UserDefaultsState = key as keyof UserDefaultsState
      if (
        //don't wanna just check falsy, that might be wrong
        loadUserDefault(keyTyped) === undefined ||
        loadUserDefault(keyTyped) === null ||
        loadUserDefault(keyTyped) === ""
      ) {
        save(`${userDefaultsKey}.${keyTyped}`, userDefaults[keyTyped]) //cant use saveuserdefault
      }
    }
  }
  setIfNeeded({ paddingToAdd: 1.2 })
  setIfNeeded({ maxNumberOfVideos: 25 })
  setIfNeeded({ numberOfWordReps: 3 })
  setIfNeeded({ subtitleLanguageCode: "en" })
  setIfNeeded({ videoSource: "Channel" })
  setIfNeeded({ downloadOrder: "allMainThenAllAlt" })

  const emptyWord: Word = { mainWord: "", originalUnfilteredWord: "" } //so the user can add their own words without using the file
  setIfNeeded({ words: [emptyWord] })
}

export function saveUserDefault(userDefault: UserDefaultsState) {
  for (const key in userDefault) {
    const keyTyped: keyof UserDefaultsState = key as keyof UserDefaultsState
    save(`${userDefaultsKey}.${keyTyped}`, userDefault[keyTyped])
  }
}
export function loadUserDefault(key: keyof UserDefaultsState) {
  return load(`${userDefaultsKey}.${key}`)
}

export let userDefaultsOnStart: UserDefaultsState //this should be the source of truth to use settings througout the run
export function setUserDefaultsOnStart() {
  userDefaultsOnStart = load(`${userDefaultsKey}`)
  if (!userDefaultsOnStart.outputFolderName) {
    createOutputName(userDefaultsOnStart)
  }
}

export function createOutputName(userDefaults: UserDefaultsState): string {
  let result: string = ""
  if (userDefaults.videoSource === "Channel" && userDefaults.channelId)
    result = userDefaults.channelId
  if (userDefaults.videoSource === "Playlist" && userDefaults.playlistId)
    result = userDefaults.playlistId
  if (userDefaults.videoSource === "Text file" && userDefaults.videoTextFile)
    result = userDefaults.videoTextFile
  result += "_" + Date.now().toString() //so it's unique every time
  return result
}
