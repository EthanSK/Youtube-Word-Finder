import React, { useEffect } from "react"
import "./App.css"
import { IpcRenderer } from "electron"
import Header from "../elements/Header/Header"
import HomePage from "../pages/HomePage/HomePage"
declare global {
  interface Window {
    require: (
      module: "electron"
    ) => {
      ipcRenderer: IpcRenderer
    }
  }
}
const { ipcRenderer } = window.require("electron")

const App: React.FC = () => {
  useEffect(() => {
    ipcRenderer.on("test", (event, data) => {
      console.log("ipc registered test event", data)
    })
    return () => {
      ipcRenderer.removeListener("test", () => {
        console.log("ipc removed test event listener")
      })
    }
  }, [])
  return (
    <div className="App">
      <Header title="Youtuber Word Finder Bot" />
      <HomePage />
    </div>
  )
}

export default App
