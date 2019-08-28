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
        userDefaultsState.numberOfWordReps !== undefined
          ? userDefaultsState.numberOfWordReps.toString()
          : undefined
      }
      numberInputOptions={{ step: 1, min: 1, max: 1000, isInt: true }}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "This is the number of times to get the same word. The higher it is, the longer the bot will run"
        }
      }}
      onFinishEditing={function(event) {
        let newText: number | undefined = parseInt(event.target.value)
        if (Number.isNaN(newText)) newText = undefined
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
