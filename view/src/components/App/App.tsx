import React from "react"
import "./App.css"
import HomePage from "../pages/HomePage/HomePage"

//this is kinda badly name, App just means the main window. cba to refactor.
const App: React.FC = () => {
  return (
    <div>
      <div className="fadeIn" />
      <div className="App">
        <HomePage />
      </div>
    </div>
  )
}

export default App
