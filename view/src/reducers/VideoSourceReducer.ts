export type VideoSourceState = "channel" | "playlist" | "textFile"

const videoSourceReducer = (
  state: VideoSourceState,
  action: { type: "showChannelUI" | "showPlaylistUI" | "showTextFileUI" }
) => {
  switch (action.type) {
    case "showChannelUI":
      return "channel"
    case "showPlaylistUI":
      return "playlist"
    case "showTextFileUI":
      return "textFile"
    default:
      return state
  }
}

export default videoSourceReducer
