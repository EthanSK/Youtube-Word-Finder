import React, { useEffect, useContext } from "react"
import "./App.css"
import Header from "../elements/Header/Header"
import HomePage from "../pages/HomePage/HomePage"
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
        <Header title="Youtuber Word Finder Bot" />
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
    ipcRenderer.on(channel, (event, data) => {
      // console.log("restore user def: ", data)
      userDefaultsDispatch({ type: "restore", payload: data })
    })
    return () => {
      ipcRenderer.removeListener(channel, () => {})
    }
  })
  return null
}

export default App
