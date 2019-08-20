import React, { useContext } from "react"
import Header from "../../elements/Header/Header"
import WordOptionRow from "../../containers/WordOptionRow/WordOptionRow"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const WordOptionsList = () => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  const list = userDefaultsState.words.map(word => (
    <WordOptionRow word={word} key={word.mainWord} />
  ))
  return <ol>{list}</ol>
}

const WordOptionsPage = () => {
  return (
    <div>
      <WordOptionsList />
    </div>
  )
}
export default WordOptionsPage
