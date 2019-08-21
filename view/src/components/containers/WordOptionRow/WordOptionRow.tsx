import React from "react"
import "./WordOptionRow.css"
import Button from "../../elements/Button/Button"

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

const WordOptionRow = (props: { word: Word; key: string }) => {
  return (
    <div className="wordOptionRow">
      <button className="deleteButton" onClick={event => {}}>
        ❌
      </button>
      <input
        className="textBox wordOptionTextBox"
        onBlur={event => {}}
        defaultValue={props.word.mainWord} //doesn't accept input if using just value
      />
      <button
        className={`smallButton findManuallyButton`}
        onClick={event => {}}
      >
        {"Find manually"}
      </button>
    </div>
  )
}

export default WordOptionRow
