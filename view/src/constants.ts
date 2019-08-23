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
  maxConsoleOutputMessagesToDisplay: 500,
  fileChooserDefaultOptions,
  folderChooserDefaultOptions,
  maxNumAltWordsToDisplay: 30
}

export default constants
