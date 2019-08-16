import React, { createContext, useReducer } from "react"
import userDefaultsReducer, {
  UserDefaultsState,
  UserDefaultAction
} from "../reducers/UserDefaultsReducer"

type UserDefaultsContextType = {
  state: UserDefaultsState
  dispatch: React.Dispatch<UserDefaultAction>
}

const initState: UserDefaultsState = {
  videoSourceState: "textFile"
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
