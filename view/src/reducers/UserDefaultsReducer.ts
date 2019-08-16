export type UserDefaultsState = {
  videoSourceState: "channel" | "playlist" | "textFile"
  channelId: string
}

export type UserDefaultAction = Partial<UserDefaultsState> //because we usually only change one thing at a time

const userDefaultsReducer = (
  state: UserDefaultsState,
  action: UserDefaultAction
) => {
  return { ...state, action } //override/set the new values got in action
}

export default userDefaultsReducer
