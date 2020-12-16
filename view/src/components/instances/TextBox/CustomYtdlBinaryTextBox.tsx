import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import WordsToFindTextFileButton from "../FileChooserButton/WordsToFindTextFileChooser"
import CookiesTextFile from "../FileChooserButton/CookiesTextFile"
import CustomYtdlBinary from "../FileChooserButton/CustomYtdlBinary"

const CustomYtdlBinaryTextBox = (props: { key: string }) => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key={"CustomYtdlBinaryTextBox"}
      textBoxId="customYtdlBinary"
      labelText="Custom youtube-dl binary"
      fileChooser={<CustomYtdlBinary />}
      allowManualInputFileChooser={true}
      placeholder="Optional: Path to custom youtube-dl Binary"
      initialText={userDefaultsState.customYtdlBinary}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "If you are experiencing bugs with the official youtube-dl binary, and have found a fork of youtube-dl that has a fix to that bug, then provide the path to the custom binary built from that fork here and use it until youtube-dl fix the official binary.",
        },
      }}
      onFinishEditing={(e) => {
        userDefaultsDispatch({
          type: "set",
          payload: { customYtdlBinary: e.target.value },
        })
      }}
      //no onfinishediting here because it can't be edited, it is done in the file choose
    />
  )
}

export default CustomYtdlBinaryTextBox
