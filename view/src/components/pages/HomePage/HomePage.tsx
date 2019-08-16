import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../../elements/ConsoleOutput/ConsoleOutput"
import BigButton from "../../elements/BigButton/BigButton"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import SplitRow from "../../containers/SplitRow/SplitRow"
import UserDefaultsContextProvider from "../../../contexts/UserDefaultsContext"
import VideoSourceDropdown from "../../instances/Dropdown/VideoSourceDropdown"
import ChannelIdTextBox from "../../instances/TextBox/ChannelIdTextBox"

const HomePage = () => {
  return (
    <UserDefaultsContextProvider>
      <div className="homePageContainer">
        <div className="homePageLeftSide">
          <SplitRow>
            <VideoSourceDropdown key="VideoSourceDropdownInstance" />
            <div />
          </SplitRow>
          <ChannelIdTextBox key="ChannelIdTextBoxInstance" />
          <TextBoxContainer
            key="textFile"
            textBoxId="textFileVideoSource"
            labelText="Words to find"
            placeholder="Text file containing the words"
            fileChooserType="file"
            initialText=""
          />
          <TextBoxContainer
            key="textFileWords"
            textBoxId="textFileWords"
            labelText="Videos"
            placeholder="Text file containing the videos"
            fileChooserType="file"
            initialText=""
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
