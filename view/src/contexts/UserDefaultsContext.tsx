import React, { createContext, useReducer } from "react"
import userDefaultsReducer, {
  UserDefaultsState,
  UserDefaultAction
} from "../reducers/UserDefaultsReducer"

type UserDefaultsContextType = {
  state: UserDefaultsState
  dispatch: React.Dispatch<UserDefaultAction>
}

//init state important to have to set init values of ui elems
const initState: UserDefaultsState = {
  videoSource: "channel",
  channelId: "aeou"
}

export const UserDefaultsContext = createContext<UserDefaultsContextType>(
  {} as UserDefaultsContextType
)

const UserDefaultsContextProvider = (props: { children?: any }) => {
  const [state, dispatch] = useReducer(userDefaultsReducer, initState)
  return (
    <UserDefaultsContext.Provider value={{ state, dispatch: dispatch }}>
      {props.children}
    </UserDefaultsContext.Provider>
  )
}

export default UserDefaultsContextProvider
