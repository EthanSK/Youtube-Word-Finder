import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const PaddingToAddTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="PaddingToAddTextBox"
      textBoxId="paddingToAdd"
      labelText="Padding to add"
      placeholder="Extra time in seconds to add to start and end of clips"
      initialText={
        userDefaultsState.paddingToAdd !== null
          ? userDefaultsState.paddingToAdd.toString()
          : undefined
      }
      numberInputOptions={{ step: 0.2, min: 0, max: 10 }}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          appendToMessage:
            "This is the extra time in seconds to add to the start and end of downloaded clips"
        }
      }}
      onFinishEditing={function(event) {
        let newText: number | null = parseFloat(event.target.value)
        if (Number.isNaN(newText)) newText = null
        userDefaultsDispatch({
          type: "set",
          payload: {
            paddingToAdd: newText
          }
        })
      }}
    />
  )
}

export default PaddingToAddTextBox
