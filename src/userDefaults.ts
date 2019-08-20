import { ipcMain } from "electron"
import { handleNewWordsTextFile } from "./words"
import { save, load } from "./store"

const userDefaultsKey = "userDefaults"

type UserDefaultName =
  | "videoSource"
  | "channelId"
  | "playlistId"
  | "videoTextFile"
  | "outputLocation"
  | "wordsToFindTextFile"
  | "outputFolderName"
  | "paddingToAdd"
  | "maxNumberOfVideos"
  | "numberOfWordReps"
  | "words"

ipcMain.on("save-user-default", (event, data) => {
  for (const key in data) {
    saveUserDefault(key as UserDefaultName, data[key])
    if (key === "wordsToFindTextFile") handleNewWordsTextFile()
  }
})

ipcMain.on("restore-user-defaults", (event, data) => {
  setUserDefaultsInitialValuesIfNeeded()
  event.sender.send("restored-user-defaults", load(userDefaultsKey))
})

function setUserDefaultsInitialValuesIfNeeded() {
  function setIfNeeded(key: UserDefaultName, value: any) {
    if (loadUserDefault(key) === undefined) {
      saveUserDefault(key, value)
    }
  }
  setIfNeeded("paddingToAdd", 0)
  setIfNeeded("maxNumberOfVideos", 15)
  setIfNeeded("numberOfWordReps", 5)
  setIfNeeded("videoSource", "Channel")
}

export function saveUserDefault(key: UserDefaultName, value: any) {
  save(`${userDefaultsKey}.${key}`, value)
}
export function loadUserDefault(key: UserDefaultName) {
  return load(`${userDefaultsKey}.${key}`)
}
