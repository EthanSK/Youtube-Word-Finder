import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../../elements/ConsoleOutput/ConsoleOutput"
import BigButton from "../../elements/BigButton/BigButton"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import DropdownContainer from "../../elements/Dropdown/Dropdown"
import SplitRow from "../../containers/SplitRow/SplitRow"
import UserDefaultsContextProvider from "../../../contexts/UserDefaultsContext"
import VideoSourceDropdown from "../../instances/VideoSourceDropdown"

const HomePage = () => {
  return (
    <UserDefaultsContextProvider>
      <div className="homePageContainer">
        <div className="homePageLeftSide">
          <SplitRow>
            <VideoSourceDropdown />
            <div />
          </SplitRow>
          <TextBoxContainer
            key="channelId"
            textBoxId="channelId"
            labelText="Channel ID"
            placeholder="e.g. UCivXNaaNhyuQQO-0V9L6nFA"
          />
          <TextBoxContainer
            key="textFile"
            textBoxId="textFile"
            labelText="Text file"
            placeholder="containing the words"
            fileChooserType="file"
          />
        </div>
        <div className="homePageRightSide">
          <ConsoleOutput placeholder="👋 This app finds and downloads clips from youtube of specified words being spoken! This is the output box." />
          <BigButton title="Start" />
        </div>
      </div>
    </UserDefaultsContextProvider>
  )
}

export default HomePage
