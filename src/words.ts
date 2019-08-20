import fs from "fs"
import { loadUserDefault, saveUserDefault } from "./userDefaults"

// THIS IS DISGUSTING PRACTICE - I COPIED AND PASTED THIS WORD INTERFACE FROM THE REACT PART OF THE APP. I COULDN'T FIGURE OUT ANOTHER WAY THAT WOULDN'T TAKE LOADS OF EFFORT. FORGIVE ME O GREATER ONE.
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

//called in store userdefaults ipc listener
export async function handleNewWordsTextFile() {
  const wordArr = await parseNewWordsTextFile()
  //make it an object for easy access to each word so we can change each one individually
  const wordObjs = wordArr.map(word => {
    // return { [word.mainWord]: word }
    return word
  })
  saveUserDefault("words", wordObjs) //technically not REALLY a user default, but makes life 1million x easier since we have everythnig set up to handle user defaults easily. also it's kinda a user default. kinda.
}

async function parseNewWordsTextFile() {
  return new Promise<Word[]>((resolve, reject) => {
    fs.readFile(loadUserDefault("wordsToFindTextFile"), "utf8", (err, data) => {
      if (err) reject(err)
      else {
        // console.log("words; ", data)
        const words = data.split(/\s+/)
        const wordsPkg = words.map(word => {
          const pkg: Word = {
            mainWord: filterWord(word),
            originalUnfilteredWord: word
          }
          return pkg
        })
        resolve(wordsPkg)
      }
    })
  })
}

export function filterWord(word: string): string {
  return word.replace(/[^a-z]/gi, "")
}
