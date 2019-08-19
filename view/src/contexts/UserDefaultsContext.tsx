import React, { createContext, useReducer } from "react"
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
  videoSource: "playlist",
  channelId: "",
  playlistId: "",
  videoTextFile: ""
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
