import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const SubtitleLanguageTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key={"SubtitleLanguageTextBox"}
      textBoxId="subtitleLanguage"
      labelText="Language code"
      placeholder="e.g. en (for English subtitles)"
      initialText={userDefaultsState.subtitleLanguageCode}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "Ensure the language code you have provided is valid. For example, to scan for English subtitles, use code 'en'. Using any language other than English is purely experimental and is not guaranteed to work."
        }
      }}
      onFinishEditing={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          type: "set",
          payload: {
            subtitleLanguageCode: newText
          }
        })
      }}
    />
  )
}

export default SubtitleLanguageTextBox
