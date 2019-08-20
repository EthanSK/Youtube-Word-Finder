import React, { createContext, useReducer } from "react"
import { VideoSource } from "../components/instances/Dropdown/VideoSourceDropdown"
import userDefaultsReducer, {
  UserDefaultsState,
  UserDefaultsAction
} from "../reducers/UserDefaultsReducer"

type UserDefaultsContextType = {
  state: UserDefaultsState
  dispatch: React.Dispatch<UserDefaultsAction>
}

//init state important to have to set init values of ui elems
const initState: UserDefaultsState = {
  hasUserDefaultsLoaded: false,
  videoSource: "Playlist",
  channelId: "",
  playlistId: "",
  videoTextFile: "",
  outputLocation: "",
  wordsToFindTextFile: "",
  outputFolderName: "",
  paddingToAdd: 0,
  maxNumberOfVideos: 10,
  numberOfWordReps: 5,
  words: []
}

export const UserDefaultsContext = createContext<UserDefaultsContextType>(
  {} as UserDefaultsContextType
)

const UserDefaultsContextProvider = (props: { children?: any }) => {
  const [state, dispatch] = useReducer(userDefaultsReducer, initState)
  return (
    <UserDefaultsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserDefaultsContext.Provider>
  )
}

export default UserDefaultsContextProvider
