import React from "react"
import "./HomePage.css"
import ConsoleOutput from "../../elements/ConsoleOutput/ConsoleOutput"
import SplitRow from "../../containers/SplitRow/SplitRow"
import VideoSourceDropdown from "../../instances/Dropdown/VideoSourceDropdown"
import VideosChannelIdTextBox from "../../instances/TextBox/VideosChannelIdTextBox"
import VideosTextFileTextBox from "../../instances/TextBox/VideosTextFileTextBox"
import ConsoleOutputContextProvider from "../../../contexts/ConsoleOutputContext"
import VideosPlaylistIdTextBox from "../../instances/TextBox/VideosPlaylistIdTextBox"
import OutputLocationTextBox from "../../instances/TextBox/OutputLocationTextBox"
import WordsTextFileTextBox from "../../instances/TextBox/WordsTextFileTextBox"
import OutputFolderNameTextBox from "../../instances/TextBox/OutputFolderNameTextBox"
import PaddingToAddTextBox from "../../instances/TextBox/PaddingToAddTextBox"
import MaxNumberOfVidsTextBox from "../../instances/TextBox/MaxNumberOfVidsTextBox"
import NumberOfWordRepetitionsTextBox from "../../instances/TextBox/NumberOfWordRepetitionsTextBox"
import WordOptionsButton from "../../instances/Button/WordOptionsButton"
import Header from "../../elements/Header/Header"
import DownloadOrderDropdown from "../../instances/Dropdown/DownloadOrderDropdown"
import StartButton from "../../instances/Button/StartButton"
import SubtitleLanguageTextBox from "../../instances/TextBox/SubtitleLanguageTextBox"
import ETGgamesButton from "../../instances/Button/ETGgamesButton"
import YoutubeWordFinderWebsiteButton from "../../instances/Button/YoutubeWordFinderWebsiteButton"
import UpdateYoutubeDlButton from "../../instances/Button/UpdateYoutubeDlButton"
import ReEncodeVideosButton from "../../instances/Button/ReEncodeVideosButton"
import CookiesTextFileTextBox from "../../instances/TextBox/CookiesTextFileTextBox"
import CustomYtdlBinaryTextBox from "../../instances/TextBox/CustomYtdlBinaryTextBox"

const HomePage = () => {
  return (
    <ConsoleOutputContextProvider>
      <Header title="YouTube Word Finder" />
      {/* <ETGgamesButton></ETGgamesButton> */}
      <YoutubeWordFinderWebsiteButton></YoutubeWordFinderWebsiteButton>
      <div className="homePageContainer">
        <div className="homePageLeftSide">
          <VideoSourceDropdown key="VideoSourceDropdownInstance" />
          <VideosChannelIdTextBox key="VideosChannelIdTextBoxInstance" />
          <VideosPlaylistIdTextBox key="VideosPlaylistIdTextBoxInstance" />
          <VideosTextFileTextBox key="VideosTextFileTextBoxInstance" />
          <WordsTextFileTextBox key="WordsTextFileTextBoxInstance" />
          <SplitRow>
            <div key="div2" />
            <WordOptionsButton />
            <div key="div1" />
          </SplitRow>
          <SplitRow>
            <PaddingToAddTextBox key="PaddingToAddTextBoxInstance" />
            <MaxNumberOfVidsTextBox key="MaxNumberOfVidsTextBoxInstance" />
          </SplitRow>
          <SplitRow>
            <NumberOfWordRepetitionsTextBox key="NumberOfWordRepetitionsTextBoxInstance" />
            <SubtitleLanguageTextBox key="SubtitleLanguageTextBoxInstance"></SubtitleLanguageTextBox>
          </SplitRow>
          {/* <DownloadOrderDropdown key="DownloadOrderDropdownInstance" /> */}
          <OutputLocationTextBox key="OutputLocationTextBoxInstance" />
          <OutputFolderNameTextBox key="OutputFolderNameTextBoxInstance" />
          <CookiesTextFileTextBox key="CookiesTextFileTextBoxInstance"></CookiesTextFileTextBox>
          <CustomYtdlBinaryTextBox key="CustomYtdlBinaryTextBoxInstance"></CustomYtdlBinaryTextBox>
          <SplitRow>
            <UpdateYoutubeDlButton key="UpdateYoutubeDlButton1"></UpdateYoutubeDlButton>
            <ReEncodeVideosButton key="ReEncodeVideosButton1"></ReEncodeVideosButton>
            <div key="div3" />
          </SplitRow>
        </div>
        <div className="homePageRightSide">
          <ConsoleOutput placeholder="👋 This app finds and downloads clips from YouTube of specified words being spoken! This is the output box. If you have any problems running the app, check out the app's official webpage, or contact us!" />
          <StartButton />
        </div>
      </div>
    </ConsoleOutputContextProvider>
  )
}

export default HomePage
