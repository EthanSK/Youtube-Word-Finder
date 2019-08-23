import React, { useContext, useEffect } from "react"
import "./WordOptionRow.css"
import Button from "../../elements/Button/Button"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ipcSend } from "../../../ipc"
import constants from "../../../constants"

const { ipcRenderer } = window.require("electron")

//when updating word or alternative word, make sure to update in the main process in words.ts
export interface Word {
  mainWord: string
  originalUnfilteredWord: string
  alternativeWords?: {
    [word: string]: AlternativeWord
  }
}

export interface AlternativeWord {
  word: string
  isBeingUsed: boolean
  isFromSuggestion: boolean
  doesMatchCurrentWord: boolean // because if we edit the word, we still want to keep the ones being used, and we need a way to keep track of whether we need to fetch new similar words
  score?: number //from the api, in case we wanna use it for further sortirng
}

const WordOptionRow = (props: {
  word: Word
  key: string
  arrIndex: number
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  //this currently won't work if we add a new row or change one. it really ought to be a function to evals the key from userstate
  let key = props.arrIndex.toString() //to identify the row.

  function handleAddRowClick() {
    let newWords = [...userDefaultsState.words!]
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

    const channel = "word-filtered"
    var handleWordFiltered = function(
      event: Electron.IpcRendererEvent,
      data: { word: string; key: string }
    ) {
      if (data.key !== key) return //it's not for us!
      console.log("word filtered", data)
      let newWords = [...userDefaultsState.words!]
      newWords[props.arrIndex].mainWord = data.word
      newWords[props.arrIndex].originalUnfilteredWord = filterWordObj.word

      userDefaultsDispatch({ type: "set", payload: { words: newWords } })
    }
    ipcRenderer.once(channel, handleWordFiltered) //one time thing
  }

  function handleDeleteButtonPressed() {
    let newWords = [...userDefaultsState.words!]
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
        placeholder="Enter a word to find"
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
      <div className="scrollArea">
        <WordAlternativesList altWords={props.word.alternativeWords} />
      </div>
    </div>
  )
}

const WordAlternativesList = (props: {
  altWords?: { [word: string]: AlternativeWord }
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  let list = []
  if (props.altWords) {
    let countAdded = 0
    let keys = Object.keys(props.altWords)
    keys.sort((a, b) => {
      let scoreA = props.altWords![a].score
      if (!scoreA) scoreA = 0
      let scoreB = props.altWords![b].score
      if (!scoreB) scoreB = 0
      return scoreB - scoreA
    })
    for (const altWordKey of keys) {
      if (countAdded > constants.maxNumAltWordsToDisplay) break
      const altWord = props.altWords[altWordKey]
      if (altWord.isBeingUsed) continue
      list.push(
        <Button
          title={altWord.word + " +"}
          class="smallButton"
          extraClasses="suggestedWordAlternativeButton"
          onClick={event => {}}
        />
      )
      countAdded++
    }
  }

  return <ol className="altWordList">{list}</ol>
}

export default WordOptionRow
