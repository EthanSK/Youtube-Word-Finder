import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../../elements/ConsoleOutput/ConsoleOutput"
import BigButton from "../../elements/BigButton/BigButton"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import SplitRow from "../../containers/SplitRow/SplitRow"
import UserDefaultsContextProvider from "../../../contexts/UserDefaultsContext"
import VideoSourceDropdown from "../../instances/Dropdown/VideoSourceDropdown"
import VideosChannelIdTextBox from "../../instances/TextBox/VideosChannelIdTextBox"
import VideosTextFileTextBox from "../../instances/TextBox/VideosTextFileTextBox"
import ConsoleOutputContextProvider from "../../../contexts/ConsoleOutputContext"
import VideosPlaylistIdTextBox from "../../instances/TextBox/VideosPlaylistIdTextBox"
import OutputLocationTextBox from "../../instances/TextBox/OutputLocationTextBox"
import WordsTextFileTextBox from "../../instances/TextBox/WordsTextFileTextBox"
import OutputFolderNameTextBox from "../../instances/TextBox/OutputFolderNameTextBox"
import PaddingToAddTextBox from "../../instances/TextBox/PaddingToAddTextBox"

const HomePage = () => {
  return (
    <ConsoleOutputContextProvider>
      <div className="homePageContainer">
        <div className="homePageLeftSide">
          <VideoSourceDropdown key="VideoSourceDropdownInstance" />

          <VideosChannelIdTextBox key="VideosChannelIdTextBoxInstance" />
          <VideosPlaylistIdTextBox key="VideosPlaylistIdTextBoxInstance" />
          <VideosTextFileTextBox key="VideosTextFileTextBoxInstance" />
          <WordsTextFileTextBox key="WordsTextFileTextBoxInstance" />
          <OutputLocationTextBox key="OutputLocationTextBoxInstance" />
          <OutputFolderNameTextBox key="OutputFolderNameTextBoxInstance" />
          <PaddingToAddTextBox key="PaddingToAddTextBoxInstance" />
        </div>
        <div className="homePageRightSide">
          <ConsoleOutput placeholder="👋 This app finds and downloads clips from youtube of specified words being spoken! This is the output box." />
          <BigButton title="Start" />
        </div>
      </div>
    </ConsoleOutputContextProvider>
  )
}

export default HomePage
