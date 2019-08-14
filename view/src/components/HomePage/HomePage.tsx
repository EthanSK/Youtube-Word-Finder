import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../ConsoleOutput/ConsoleOutput"
import BigButton from "../Buttons/BigButton/BigButton"

const HomePage = () => {
  return (
    <div className="homePageContainer">
      <div className="homePageLeftSide">
        <input type="text" />
      </div>
      <div className="homePageRightSide">
        <ConsoleOutput placeholder="👋 This app finds and downloads clips from youtube of specified words being spoken! This is the output box." />
        <BigButton title="Start" />
      </div>
    </div>
  )
}

export default HomePage
