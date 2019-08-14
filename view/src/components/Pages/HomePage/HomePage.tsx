import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../../Elements/ConsoleOutput/ConsoleOutput"
import BigButton from "../../Elements/BigButton/BigButton"
import TextBoxContainer from "../../Containers/TextBoxContainer/TextBoxContainer"
import DropdownContainer from "../../Containers/DropdownContainer/DropdownContainer"

const HomePage = () => {
  return (
    <div className="homePageContainer">
      <div className="homePageLeftSide">
        <TextBoxContainer
          textBoxId="channelId"
          labelText="channel ID"
          placeholder="A channel ID e.g. UCivXNaaNhyuQQO-0V9L6nFA"
        />
        <DropdownContainer
          selectId="videoSource"
          labelText="labeletxtt"
          options={[
            {
              value: "lol",
              text: "poop"
            },
            {
              value: "aaa",
              text: "poeeuoaeuop",
              isSelected: true
            }
          ]}
        />
      </div>
      <div className="homePageRightSide">
        <ConsoleOutput placeholder="👋 This app finds and downloads clips from youtube of specified words being spoken! This is the output box." />
        <BigButton title="Start" />
      </div>
    </div>
  )
}

export default HomePage
