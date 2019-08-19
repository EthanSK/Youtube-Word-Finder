import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import WordsToFindTextFileButton from "../FileChooserButton/WordsToFindTextFileChooser"

const WordsTextFileTextBox = (props: { key: string }) => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="WordsTextFileTextBox"
      textBoxId="wordsToFind"
      labelText="Words text file"
      fileChooser={<WordsToFindTextFileButton />}
      placeholder="Text file containing the words to find"
      initialText={userDefaultsState.wordsToFindTextFile}
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
    />
  )
}

export default WordsTextFileTextBox
