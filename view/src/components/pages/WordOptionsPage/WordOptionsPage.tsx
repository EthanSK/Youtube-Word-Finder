import React, { useContext, useEffect, useState } from "react"
import WordOptionRow, {
  Word,
  filterWord
} from "../../containers/WordOptionRow/WordOptionRow"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import "./WordOptionsPage.css"
import axios from "axios"
import Button from "../../elements/Button/Button"

interface APISimilarWord {
  word: string
  score: number
  numSyllables: string
}

let isLoadingAltWords = true

const WordOptionsList = () => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  const createWordsClone = () =>
    userDefaultsState.words
      ? userDefaultsState.words.map(word => {
          return { ...word }
        })
      : undefined

  let list = []
  if (userDefaultsState.words) {
    //for words that are the same, we need a unique way to identify them, so we add the index to the key
    for (let i = 0; i < userDefaultsState.words.length; i++) {
      const word = userDefaultsState.words[i]
      list.push(
        <WordOptionRow
          word={word}
          key={word.originalUnfilteredWord + i.toString()}
          arrIndex={i}
        />
      )
    }
  }

  const [previousWordsState, setPreviousWordsState] = useState(
    createWordsClone()
  ) //we only try and get similar words when this changes in size or value

  useEffect(() => {
    if (
      userDefaultsState.words &&
      hasWordsChanged(previousWordsState, userDefaultsState.words)
    ) {
      setPreviousWordsState(createWordsClone())
      getSimilarWords(userDefaultsState.words!, userDefaultsDispatch) //don't await, it should just happen as a side effect
    }
  })

  return <ol className="wordOptionList">{list}</ol>
}

//deep check if words count or value has changed
function hasWordsChanged(wordsBefore: Word[] | undefined, wordsAfter: Word[]) {
  if (!wordsBefore) return true
  if (wordsBefore.length !== wordsAfter.length) return true
  for (let i = 0; i < wordsAfter.length; i++) {
    if (wordsBefore[i].mainWord !== wordsAfter[i].mainWord) {
      //if word has been edited, remove non used alt words.can do this since obj props done by reference
      filterNonUsedAltWords(wordsAfter[i])
      return true
    }
  }
  return false
}

function filterNonUsedAltWords(word: Word) {
  for (const altWordKey in word.alternativeWords) {
    if (word.alternativeWords) {
      if (!word.alternativeWords![altWordKey].isBeingUsed) {
        delete word.alternativeWords[altWordKey]
      } else {
        word.alternativeWords[altWordKey].doesMatchCurrentWord = false
      }
    }
  }
}

async function getSimilarWords(words: Word[], dispatch: Function) {
  function hasAltWordFromSuggestion(word: Word): boolean {
    if (word.alternativeWords) {
      for (const key in word.alternativeWords) {
        if (
          word.alternativeWords[key].isFromSuggestion &&
          word.alternativeWords[key].doesMatchCurrentWord
        )
          return true
      }
    }
    return false
  }

  let newWords = [...words]
  isLoadingAltWords = true
  await Promise.all(
    newWords.map(async word => {
      if (!hasAltWordFromSuggestion(word) && word.mainWord) {
        //we don't wanna call the api if we called it before
        console.log("calling api", word.mainWord)
        const result = await axios(
          `https://api.datamuse.com/words?sl=${word.mainWord}`
        )
        if (!word.alternativeWords) {
          word.alternativeWords = {} //need it to exist before checking if the api word has been gotten before below
        }
        const data = result.data as APISimilarWord[]
        data.forEach(apiWord => {
          const filteredWord = filterWord(apiWord.word)
          if (
            !word.alternativeWords![filteredWord] &&
            filteredWord !== word.mainWord
          ) {
            word.alternativeWords![filteredWord] = {
              word: filteredWord,
              score: apiWord.score,
              isBeingUsed: false,
              doesMatchCurrentWord: true,
              isFromSuggestion: true
            }
          }
        })
      } else {
        // console.log("already has alt word from suggestion ", word.mainWord)
      }
    })
  )
  // console.log("new words: ", newWords)
  isLoadingAltWords = false
  dispatch({ type: "set", payload: { words: newWords } })
}

const WordOptionsPage = () => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  function handleAddRowClick() {
    let newWords = [...userDefaultsState.words!]
    newWords.unshift({
      mainWord: "",
      originalUnfilteredWord: ""
    })
    // console.log("newWords", newWords)
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleAddTopAlternativeClick() {
    let newWords = [...userDefaultsState.words!]

    newWords.forEach(word => {
      if (word.alternativeWords) {
        let keys = Object.keys(word.alternativeWords)
        keys = keys
          .sort((a, b) => {
            let scoreA = word.alternativeWords![a].score
            if (!scoreA) scoreA = 0
            let scoreB = word.alternativeWords![b].score
            if (!scoreB) scoreB = 0
            return scoreB - scoreA
          })
          .filter(key => word.alternativeWords![key].isBeingUsed === false)
        if (word.alternativeWords[keys[0]]) {
          word.alternativeWords[keys[0]].isBeingUsed = true
        }
      }
    })
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  function handleRemovAllAlternativesClick() {
    let newWords = [...userDefaultsState.words!]

    newWords.forEach(word => {
      if (word.alternativeWords) {
        let keys = Object.keys(word.alternativeWords)
        for (const altWordKey of keys) {
          if (word.alternativeWords[altWordKey]) {
            word.alternativeWords[altWordKey].isBeingUsed = false
          }
        }
      }
    })
    userDefaultsDispatch({ type: "set", payload: { words: newWords } })
  }

  return (
    <div id="wordOptionsPageId">
      {/* <label className="smallColumnHeadingLabel">
        Alternative words{isLoadingAltWords ? " - Loading..." : ""}
      </label> */}
      <Button
        title="Add next alternative to all"
        class="mediumButton"
        onClick={handleAddTopAlternativeClick}
      />
      <Button
        title="Remove all alternatives"
        class="mediumButton"
        onClick={handleRemovAllAlternativesClick}
      />
      <div className="separatorContainer">
        <Button
          title="+"
          class="emojiButton"
          extraClasses="addRowButton addRowTop"
          onClick={handleAddRowClick}
        />
        <hr className="lineSeparator" />
      </div>

      <WordOptionsList />
    </div>
  )
}
export default WordOptionsPage
