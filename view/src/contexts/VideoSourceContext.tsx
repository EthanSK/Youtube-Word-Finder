import React, { createContext, useReducer } from "react"
import videoSourceReducer, {
  VideoSourceState
} from "../reducers/VideoSourceReducer"

const initState: VideoSourceState = "channel"

const defaultValue: {
  state: VideoSourceState
  dispatch?: any
} = {
  state: initState
}

export const VideoSourceContext = createContext(defaultValue)

const VideoSourceContextProvider = (props: { children?: any }) => {
  const [state, dispatch] = useReducer(videoSourceReducer, initState)
  return (
    <VideoSourceContext.Provider value={{ state, dispatch }}>
      {props.children}
    </VideoSourceContext.Provider>
  )
}

export default VideoSourceContextProvider
