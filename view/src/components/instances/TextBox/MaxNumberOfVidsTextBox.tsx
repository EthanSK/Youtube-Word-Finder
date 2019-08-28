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
      labelText="Max. vids"
      placeholder="Max number of videos to search"
      initialText={
        userDefaultsState.maxNumberOfVideos !== undefined
          ? userDefaultsState.maxNumberOfVideos.toString()
          : undefined
      }
      isHidden={userDefaultsState.videoSource === "Text file"}
      numberInputOptions={{ step: 1, min: 1, max: 1000, isInt: true }}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "This is the maximum number of videos to search through. The higher it is, the longer the bot will run"
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
