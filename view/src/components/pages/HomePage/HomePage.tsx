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
import FileChooserButton from "../../elements/FileChooserButton/FileChooserButton"
import OutputLocationTextBox from "../../instances/TextBox/OutputLocationTextBox"

const HomePage = () => {
  return (
    <ConsoleOutputContextProvider>
      <div className="homePageContainer">
        <div className="homePageLeftSide">
          <SplitRow>
            <VideoSourceDropdown key="VideoSourceDropdownInstance" />
            <div />
          </SplitRow>
          <VideosChannelIdTextBox key="VideosChannelIdTextBoxInstance" />
          <VideosPlaylistIdTextBox key="VideosPlaylistIdTextBoxInstance" />
          <VideosTextFileTextBox key="VideosTextFileTextBoxInstance" />
          <OutputLocationTextBox key="OutputLocationTextBoxInstance" />
          <TextBoxContainer
            key="textFileWords"
            textBoxId="textFileWords"
            labelText="Words to find"
            placeholder="Text file containing the words"
            initialText=""
            onFinishEditing={function() {}}
            consoleOutputOptions={{
              useDefaultIfUndefined: false,
              payload: { shouldOutput: false }
            }}
          />
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
