import React from "react"
import "./WordOptionRow.css"

export interface Word {
  mainWord: string
  isDeleted: boolean
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
        className="textBox"
        onBlur={event => {}}
        defaultValue={props.word.mainWord} //doesn't accept input if using just value
      />
    </div>
  )
}

export default WordOptionRow
