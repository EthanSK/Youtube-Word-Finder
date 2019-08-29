import React, { useContext } from "react"
import "./WordOptionRow.css"
import Button from "../../elements/Button/Button"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import constants from "../../../constants"
import { ipcSend } from "../../../ipc"

export function filterWord(word: string): string {
  return word.replace(/[^0-9a-z]/gi, "").toLowerCase() //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}

export function shouldApplyWordFilter(
  subtitleLanguageCode: string | undefined
): boolean {
  return subtitleLanguageCode === "en" //for non english languages, we can't possibly know what weird characters exist in the language, so just don't bother.
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

  // console.log(props.word.originalUnfilteredWord, props.word.mainWord)

  //this currently won't work if we add a new row or change one. it really ought to be a function to evals the key from userstate
  // let key = props.arrIndex.toString() //to identify the row.

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
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    //for reference - this is the old way, that i cba to change for the other functions.
    // let newWords = [...userDefaultsState.words!]
    // newWords[props.arrIndex].mainWord = filterWord(event.currentTarget.value)
    // newWords[props.arrIndex].originalUnfilteredWord = event.currentTarget.value
    // userDefaultsDispatch({ type: "set", payload: { words: newWords } })

    let newWord: Word = userDefaultsState.words![props.arrIndex] //keep current word
    newWord.mainWord = shouldApplyWordFilter(
      userDefaultsState.subtitleLanguageCode
    )
      ? filterWord(event.currentTarget.value)
      : event.currentTarget.value

    newWord.originalUnfilteredWord = event.currentTarget.value
    userDefaultsDispatch({
      type: "setWord",
      wordPkg: { arrIndex: props.arrIndex, word: newWord }
    })
  }

  function handleDeleteButtonPressed() {
    let newWords = [...userDefaultsState.words!]
    if (newWords.length <= 1) {
      return
    } //only delete if there is more than one word left

    newWords.splice(props.arrIndex, 1)
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleFindManuallyPressed() {
    ipcSend("open-word-finder", {
      word: props.word,
      arrIndex: props.arrIndex
    })
  }

  function handleAltWordTextBox(event: React.ChangeEvent<HTMLInputElement>) {
    let newWords = [...userDefaultsState.words!]

    if (!props.word.alternativeWords) {
      newWords[props.arrIndex].alternativeWords = {} //need it to exist before checking if the api word has been gotten before below
    }
    const filteredWord = shouldApplyWordFilter(
      userDefaultsState.subtitleLanguageCode
    )
      ? filterWord(event.currentTarget.value)
      : event.currentTarget.value
    if (
      // !props.word.alternativeWords![filteredWord] && //don't do this because if similar word is already in suggested, it won't show
      filteredWord !== props.word.mainWord &&
      filteredWord !== ""
    ) {
      newWords[props.arrIndex].alternativeWords![filteredWord] = {
        word: filteredWord,
        score: -Date.now(), //so it always appears first
        isBeingUsed: true,
        doesMatchCurrentWord: true,
        isFromSuggestion: false
      }
    }
    event.currentTarget.value = ""
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleClearAllClick() {
    let newWords = [...userDefaultsState.words!]

    if (props.word.alternativeWords) {
      let keys = Object.keys(props.word.alternativeWords)
      for (const altWordKey of keys) {
        if (props.word.alternativeWords[altWordKey]) {
          props.word.alternativeWords[altWordKey].isBeingUsed = false
        }
      }
    }

    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }
  return (
    <div className="wordOptionRowContainer">
      <div className="wordOptionRow">
        <Button
          title="❌"
          class="emojiButton"
          onClick={handleDeleteButtonPressed}
        />
        <input
          className="textBox wordOptionTextBox"
          onBlur={event => handleTextBoxFinishEditing(event)}
          defaultValue={(function() {
            return props.word.mainWord
          })()} //doesn't accept input if using just value
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
        <input
          key={props.word.originalUnfilteredWord}
          className="textBox altWordTextBox"
          onBlur={event => handleAltWordTextBox(event)}
          placeholder="Alternative word"
          onKeyPress={event => {
            if (event.key === "Enter") {
              event.currentTarget.blur()
            }
          }}
        />
        <div className="scrollArea">
          <WordAlternativesList
            altWords={props.word.alternativeWords}
            isForBeingUsed={false}
            arrIndex={props.arrIndex}
          />
        </div>
      </div>
      <div id="altWordsBeingUsed">
        <WordAlternativesList
          altWords={props.word.alternativeWords}
          isForBeingUsed={true}
          arrIndex={props.arrIndex}
        />
        <Button
          title="Clear alternatives"
          onClick={handleClearAllClick}
          class="smallButton"
          isHidden={
            (props.word.alternativeWords &&
              Object.keys(props.word.alternativeWords).filter(
                key => props.word.alternativeWords![key].isBeingUsed
              ).length === 0) ||
            !props.word.alternativeWords
          }
          extraClasses="clearAlternativesButton"
        />
      </div>
      <div className="separatorContainer">
        <Button
          title="+"
          class="emojiButton"
          extraClasses="addRowButton"
          onClick={handleAddRowClick}
        />
        <hr className="lineSeparator" />
      </div>
    </div>
  )
}

const WordAlternativesList = (props: {
  altWords?: { [word: string]: AlternativeWord }
  isForBeingUsed: boolean
  arrIndex: number
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
      if (
        !props.isForBeingUsed &&
        countAdded > constants.maxNumAltWordsToDisplay
      )
        break
      const altWord = props.altWords[altWordKey]
      if (!props.isForBeingUsed && altWord.isBeingUsed) continue
      if (props.isForBeingUsed && !altWord.isBeingUsed) continue

      list.push(
        <Button
          key={altWordKey}
          title={altWord.word + (props.isForBeingUsed ? " ×" : " +")}
          class="smallButton"
          extraClasses={
            props.isForBeingUsed
              ? "usedWordAlternativeButton"
              : "suggestedWordAlternativeButton"
          }
          onClick={event => {
            let newWords = [...userDefaultsState.words!]
            newWords[props.arrIndex].alternativeWords![
              altWord.word
            ].isBeingUsed = !props.isForBeingUsed
            userDefaultsDispatch({ type: "set", payload: { words: newWords } })
          }}
        />
      )
      countAdded++
    }
  }

  return <ol className="altWordList">{list}</ol>
}

export default WordOptionRow
