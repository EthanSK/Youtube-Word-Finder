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
  const words = await parseNewWordsTextFile()
  saveUserDefault("words", words)
}

async function parseNewWordsTextFile() {
  return new Promise<Word[]>((resolve, reject) => {
    fs.readFile(loadUserDefault("wordsToFindTextFile"), "utf8", (err, data) => {
      if (err) reject(err)
      else {
        // console.log("words; ", data)
        const words = data.split(/\s+/)
        const wordsPkg = words
          .map(word => {
            const pkg: Word = {
              mainWord: filterWord(word),
              originalUnfilteredWord: word
            }
            return pkg
          })
          .filter(wordPkg => {
            return wordPkg.mainWord !== "" //remove empty ones
          })

        resolve(wordsPkg)
      }
    })
  })
}

export function filterWord(word: string): string {
  return word.replace(/[^0-9a-z]/gi, "") //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}
