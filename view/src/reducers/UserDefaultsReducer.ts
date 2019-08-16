export type UserDefaultsState = {
  videoSource: "channel" | "playlist" | "textFile"
  channelId: string
  playlistId: string
  videoTextFile: string
}

export type UserDefaultsAction = Partial<UserDefaultsState> //because we usually only change one thing at a time

const userDefaultsReducer = (
  state: UserDefaultsState,
  action: UserDefaultsAction
) => {
  const newState = { ...state, ...action } //the last object spead takes priority for dup keys
  // console.log("new state: ", newState)
  return newState //override/set the new values got in action
}

export default userDefaultsReducer
