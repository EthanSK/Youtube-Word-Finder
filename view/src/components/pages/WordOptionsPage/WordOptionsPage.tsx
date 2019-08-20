import React, { useContext } from "react"
import Header from "../../elements/Header/Header"
import WordOptionRow from "../../containers/WordOptionRow/WordOptionRow"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import "./WordOptionsPage.css"

const WordOptionsList = () => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  let list: JSX.Element[] = []
  if (userDefaultsState.words) {
    list = userDefaultsState.words.map(word => {
      // console.log("word", word)
      return <WordOptionRow word={word} key={word.mainWord} />
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
