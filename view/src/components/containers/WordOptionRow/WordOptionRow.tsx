import React, { useContext } from "react"
import "./WordOptionRow.css"
import Button from "../../elements/Button/Button"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

export interface Word {
  mainWord: string
  originalUnfilteredWord: string
  isDeleted?: boolean
  alternativeWords?: {
    word: string
    isBeingUsed: boolean
    isFromSuggestion: boolean
  }
}

const WordOptionRow = (props: {
  word: Word
  key: string
  arrIndex: number
}) => {
  const {
    state: userDefaultState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  function handleAddRowClick() {
    let newWords = [...userDefaultState.words!]
    newWords.splice(props.arrIndex + 1, 0, {
      mainWord: "",
      originalUnfilteredWord: ""
    })
    // console.log("newWords", newWords)
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleTextBoxFinishEditing(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    //make sure we send ipc req to main to get it to filter the word, and then ONCE we receive a response, we update the state of the text box to the new text.
  }

  function handleDeleteButtonPressed() {
    let newWords = [...userDefaultState.words!]
    if (newWords.length <= 1) {
      return
    } //only delete if there is more than one word left
    newWords.splice(props.arrIndex, 1)
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleFindManuallyPressed() {}

  return (
    <div className="wordOptionRow">
      <Button
        title="+"
        class="emojiButton"
        extraClasses="addRowButton"
        onClick={handleAddRowClick}
      />
      <Button
        title="❌"
        class="emojiButton"
        onClick={handleDeleteButtonPressed}
      />
      <input
        className="textBox wordOptionTextBox"
        onBlur={event => handleTextBoxFinishEditing(event)}
        defaultValue={props.word.mainWord} //doesn't accept input if using just value
      />

      <Button
        title="🔎"
        class="emojiButton"
        onClick={handleFindManuallyPressed}
      />
    </div>
  )
}

export default WordOptionRow
