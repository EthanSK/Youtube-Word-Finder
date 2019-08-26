import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const MaxNumberOfVidsTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  return (
    <TextBoxContainer
      key="NumberOfVidsTextBox"
      textBoxId="maxNumberOfVids"
      labelText="Max vids"
      placeholder="Max number of videos to search"
      initialText={
        userDefaultsState.maxNumberOfVideos !== undefined
          ? userDefaultsState.maxNumberOfVideos.toString()
          : undefined
      }
      numberInputOptions={{ step: 1, min: 1, max: 100, isInt: true }}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "This is the maximum number of videos to search through. Don't set it too high or the bot will take a long time to run"
        }
      }}
      onFinishEditing={function(event) {
        let newText: number | undefined = parseInt(event.target.value)
        if (Number.isNaN(newText)) newText = undefined
        userDefaultsDispatch({
          type: "set",
          payload: {
            maxNumberOfVideos: newText
          }
        })
      }}
    />
  )
}

export default MaxNumberOfVidsTextBox
