import { OpenDialogOptions } from "electron"

const fileChooserDefaultOptions: OpenDialogOptions = {
  title: "Choose a file!",
  message: "Choose a file!", //this is what actually shows up in the dialog...
  buttonLabel: "Choose",
  filters: [
    {
      name: "Text Files",
      extensions: ["txt"]
    }
  ],
  properties: ["openFile", "createDirectory"]
}

const folderChooserDefaultOptions: OpenDialogOptions = {
  title: "Choose a folder!",
  buttonLabel: "Choose",
  properties: ["openDirectory", "createDirectory"]
}

const constants = {
  maxConsoleOutputMessagesToDisplay: 3000,
  fileChooserDefaultOptions,
  folderChooserDefaultOptions,
  maxNumAltWordsToDisplay: 30,
  youtubeVideoURLPrefix: "https://www.youtube.com/watch?v="
}

export default constants
