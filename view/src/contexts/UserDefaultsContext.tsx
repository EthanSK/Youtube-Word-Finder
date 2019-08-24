import React, { createContext, useReducer } from "react"
import { VideoSource } from "../components/instances/Dropdown/VideoSourceDropdown"
import userDefaultsReducer, {
  UserDefaultsAction
} from "../reducers/UserDefaultsReducer"

type UserDefaultsContextType = {
  state: UserDefaultsState
  dispatch: React.Dispatch<UserDefaultsAction>
}

//init state important to have to set init values of ui elems
// I think the solution to this not updating thing is to not set any initial values here, rather set them in the user defaults, so when it comes time for a textbox to render, the initial value won't have already been set, and it can populate it correctly.
const initState: UserDefaultsState = {}

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
