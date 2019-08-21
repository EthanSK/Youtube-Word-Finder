import fs from "fs"
import { loadUserDefault, saveUserDefault } from "./userDefaults"
import { ipcMain } from "electron"

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
        let wordsPkg = words
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

        wordsPkg.unshift({ mainWord: "", originalUnfilteredWord: "" }) //so the user can add their own words without using the file

        resolve(wordsPkg)
      }
    })
  })
}

export function filterWord(word: string): string {
  return word.replace(/[^0-9a-z]/gi, "").toLowerCase() //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}

ipcMain.on("filter-word", (event, data: { word: string; key: string }) => {
  const filterWordObj = {
    word: filterWord(data.word),
    key: data.key //so we can identify the correct box if multiple are listening
  }
  event.sender.send("word-filtered", filterWordObj)
})
