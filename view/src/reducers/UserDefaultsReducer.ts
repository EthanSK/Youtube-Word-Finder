export type UserDefaultsState = {
  videoSourceState: "channel" | "playlist" | "textFile"
}

export type UserDefaultAction = {
  type: {
    videoSourceAction:
      | "useChannelState"
      | "usePlaylistState"
      | "useTextFileState"
  }
}

const userDefaultsReducer = (
  state: UserDefaultsState,
  action: UserDefaultAction
) => {
  let newState: UserDefaultsState = state

  switch (action.type.videoSourceAction) {
    case "useChannelState":
      newState.videoSourceState = "channel"
      break
    case "usePlaylistState":
      newState.videoSourceState = "playlist"
      break
    case "useTextFileState":
      newState.videoSourceState = "textFile"
      break
    default:
      newState = state
  }

  return newState
}

export default userDefaultsReducer
