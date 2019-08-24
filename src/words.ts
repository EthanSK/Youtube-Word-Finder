import fs from "fs"
import { loadUserDefault, saveUserDefault } from "./userDefaults"
import { ipcMain } from "electron"

//called in store userdefaults ipc listener
export async function handleNewWordsTextFile() {
  const words = await parseNewWordsTextFile()
  saveUserDefault({ words })
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

        resolve(wordsPkg)
      }
    })
  })
}

export function filterWord(word: string): string {
  return word.replace(/[^0-9a-z]/gi, "").toLowerCase() //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}
