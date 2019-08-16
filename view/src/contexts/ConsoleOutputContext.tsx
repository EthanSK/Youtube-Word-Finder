import React, { createContext, useReducer } from "react"
import consoleOutputReducer, {
  ConsoleOutputState,
  ConsoleOutputAction
} from "../reducers/ConsoleOutputReducer"

type ConsoleOutputContextType = {
  state: ConsoleOutputState
  dispatch: React.Dispatch<ConsoleOutputAction>
}

//init state important to have to restore console from previous app session
const initState: ConsoleOutputState = []

export const ConsoleOutputContext = createContext<ConsoleOutputContextType>(
  {} as ConsoleOutputContextType
)

const ConsoleOutputContextProvider = (props: { children?: any }) => {
  const [state, dispatch] = useReducer(consoleOutputReducer, initState)
  return (
    <ConsoleOutputContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ConsoleOutputContext.Provider>
  )
}

export default ConsoleOutputContextProvider
