import React, { useContext } from "react"
import Header from "../../elements/Header/Header"
import WordOptionRow from "../../containers/WordOptionRow/WordOptionRow"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import "./WordOptionsPage.css"


const { ipcRenderer } = window.require("electron")

const WordOptionsList = () => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  let list = []
  if (userDefaultsState.words) {
    //for words that are the same, we need a unique way to identify them, so we add the index to the key
    for (let i = 0; i < userDefaultsState.words.length; i++) {
      const word = userDefaultsState.words[i]
      list.push(
        <WordOptionRow
          word={word}
          key={word.mainWord + i.toString()}
          arrIndex={i}
        />
      )
    }
  }
  ipcRenderer.setMaxListeners(list.length) //tbh it's 2019 computers are fast enough to handle these listeners. 

  return <ol className="wordOptionList">{list}</ol>
}

const WordOptionsPage = () => {
  return (
    <div>
      <WordOptionsList />
    </div>
  )
}
export default WordOptionsPage
