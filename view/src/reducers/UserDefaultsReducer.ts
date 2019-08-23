import { ipcSend } from "../ipc"
import { VideoSource } from "../components/instances/Dropdown/VideoSourceDropdown"
import { Word } from "../components/containers/WordOptionRow/WordOptionRow"
import { DownloadOrder } from "../components/instances/Dropdown/DownloadOrderDropdown"

export type UserDefaultsState = {
  hasUserDefaultsLoaded?: boolean
  videoSource?: VideoSource
  channelId?: string
  playlistId?: string
  videoTextFile?: string
  outputLocation?: string
  wordsToFindTextFile?: string
  outputFolderName?: string
  paddingToAdd?: number
  maxNumberOfVideos?: number
  numberOfWordReps?: number
  words?: Word[]
  downloadOrder?: DownloadOrder
}

export interface UserDefaultsAction {
  type: "set" | "restore"
  payload: Partial<UserDefaultsState>
}

const userDefaultsReducer = (
  state: UserDefaultsState,
  action: UserDefaultsAction
) => {
  const newState = { ...state, ...action.payload } //the last object spead takes priority for dup keys
  if (action.type !== "restore") {
    ipcSend("save-user-default", action.payload)
  }

  // console.log("new state; ", newState)
  return newState //override/set the new values got in action
}

export default userDefaultsReducer
