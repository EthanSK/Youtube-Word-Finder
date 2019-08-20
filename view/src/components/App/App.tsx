import React, { useEffect, useContext } from "react"
import "./App.css"
import Header from "../elements/Header/Header"
import HomePage from "../pages/HomePage/HomePage"
import { UserDefaultsState } from "../../reducers/UserDefaultsReducer"
import UserDefaultsContextProvider, {
  UserDefaultsContext
} from "../../contexts/UserDefaultsContext"

const { ipcRenderer } = window.require("electron")

const App: React.FC = () => {
  return (
    <UserDefaultsContextProvider>
      <div className="fadeIn" />
      <UserDefaults />
      <div className="App">
        <HomePage />
      </div>
    </UserDefaultsContextProvider>
  )
}

const UserDefaults = () => {
  //because the ipc.on needs to be wrapped by the context provider
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)
  useEffect(() => {
    const channel = "restore-user-defaults"
    var handleUserDefaultRestore = function(
      event: Electron.IpcRendererEvent,
      data: UserDefaultsState
    ) {
      console.log("restoring: ", data)
      data.hasUserDefaultsLoaded = true
      userDefaultsDispatch({ type: "restore", payload: data })
    }
    ipcRenderer.once(channel, handleUserDefaultRestore) //one time thing
    return () => {
      ipcRenderer.removeListener(channel, handleUserDefaultRestore)
    }
  })
  return null
}

export default App
