import React, { useContext } from "react"
import Header from "../../elements/Header/Header"
import WordOptionRow from "../../containers/WordOptionRow/WordOptionRow"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import "./WordOptionsPage.css"

const WordOptionsList = () => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  let list: JSX.Element[] = []
  if (userDefaultsState.words) {
    let counter = 0 //for words that are the same, we need a unique way to identify them.
    list = userDefaultsState.words.map(word => {
      counter++
      return (
        <WordOptionRow word={word} key={word.mainWord + counter.toString()} />
      )
    })
  }

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
