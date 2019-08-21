import React, { useContext, useEffect, useState } from "react"
import "./WordOptionRow.css"
import Button from "../../elements/Button/Button"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ipcSend } from "../../../ipc"

const { ipcRenderer } = window.require("electron")

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

  const [isWaitingForFilteredWord, setIsWaitingForFilteredWord] = useState(
    false
  )

  const key = props.word.mainWord + props.arrIndex.toString()

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
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    console.log("text changed")
    //make sure we send ipc req to main to get it to filter the word, and then ONCE we receive a response, we update the state of the text box to the new text.
    const filterWordObj = {
      word: event.currentTarget.value,
      key //so we can identify the correct box if multiple are listening
    }
    ipcSend("filter-word", filterWordObj)
    setIsWaitingForFilteredWord(true)
  }

  useEffect(() => {
    const channel = "word-filtered"
    var handleWordFiltered = function(
      event: Electron.IpcRendererEvent,
      data: { word: string; key: string }
    ) {
      if (data.key !== key) return //it's not for us!
      console.log("word filtered", data)
      setIsWaitingForFilteredWord(false)
      let newWords = [...userDefaultState.words!]
      newWords[props.arrIndex].mainWord = data.word
      userDefaultsDispatch({ type: "set", payload: { words: newWords } })
    }
    if (isWaitingForFilteredWord) ipcRenderer.once(channel, handleWordFiltered) //one time thing
    return () => {
      ipcRenderer.removeListener(channel, handleWordFiltered)
    }
  })

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
        onKeyPress={event => {
          if (event.key === "Enter") {
            event.currentTarget.blur()
          }
        }}
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
