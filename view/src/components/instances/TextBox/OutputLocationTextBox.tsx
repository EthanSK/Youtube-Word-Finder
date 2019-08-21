import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import OutputLocationFolderButton from "../FileChooserButton/OutputLocationFolderChooser"

const OutputLocationTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="OutputLocationTextBox"
      textBoxId="outputLocation"
      labelText="Output location"
      placeholder="Folder to put output files. Click folder icon."
      onFinishEditing={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            outputLocation: newText
          }
        })
      }}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      initialText={userDefaultsState.outputLocation}
      fileChooser={<OutputLocationFolderButton />}
    />
  )
}

export default OutputLocationTextBox
