import { ipcSend } from "../ipc"
import { VideoSource } from "../components/instances/Dropdown/VideoSourceDropdown"

export type UserDefaultsState = {
  videoSource: VideoSource
  channelId: string
  playlistId: string
  videoTextFile: string
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
