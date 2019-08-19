import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const OutputFolderNameTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="OutputFolderNameTextBox"
      textBoxId="outputFolderName"
      labelText="Output folder name"
      placeholder="e.g. Pewdiepie_Sings_Bitch_Lasagna"
      onFinishEditing={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            outputFolderName: newText
          }
        })
      }}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      initialText={userDefaultsState.outputFolderName}
    />
  )
}

export default OutputFolderNameTextBox
