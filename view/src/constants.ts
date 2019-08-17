import { OpenDialogSyncOptions } from "electron"

const fileChooserDefaultOptions: OpenDialogSyncOptions = {
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

const constants = {
  maxConsoleOutputMessagesToDisplay: 500,
  fileChooserDefaultOptions,

  folderChooserDefaultOptions: {
    title: "Choose a folder!",
    buttonLabel: "Choose",
    properties: ["openDirectory", "createDirectory"]
  }
}

export default constants
