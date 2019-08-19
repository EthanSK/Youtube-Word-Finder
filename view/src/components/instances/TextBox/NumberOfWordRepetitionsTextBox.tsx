import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const NumberOfWordRepetitionsTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key={"NumberOfVidsTextBox"}
      textBoxId="numberOfWordReps"
      labelText="No. word reps"
      placeholder="Number of times to get same word"
      initialText={
        userDefaultsState.numberOfWordReps !== null
          ? userDefaultsState.numberOfWordReps.toString()
          : undefined
      }
      numberInputOptions={{ step: 1, min: 1, max: 30, isInt: true }}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          appendToMessage:
            "This is the number of times to get the same word. Don't set it too high or the bot will take a long time to run"
        }
      }}
      onFinishEditing={function(event) {
        let newText: number | null = parseInt(event.target.value)
        if (Number.isNaN(newText)) newText = null
        userDefaultsDispatch({
          type: "set",
          payload: {
            numberOfWordReps: newText
          }
        })
      }}
    />
  )
}

export default NumberOfWordRepetitionsTextBox
