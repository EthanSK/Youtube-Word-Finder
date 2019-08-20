import React, { useEffect, useContext } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import ViewManager from "./ViewManager"
import UserDefaultsContextProvider, {
  UserDefaultsContext
} from "./contexts/UserDefaultsContext"
import { UserDefaultsState } from "./reducers/UserDefaultsReducer"
const { ipcRenderer } = window.require("electron")

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

//entry point
ReactDOM.render(
  <BrowserRouter>
    <UserDefaultsContextProvider>
      <UserDefaults />

      <ViewManager />
    </UserDefaultsContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
)
