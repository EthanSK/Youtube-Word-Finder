import fs from "fs"
import { loadUserDefault, saveUserDefault } from "./userDefaults"

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
              mainWord: shouldApplyWordFilter(
                loadUserDefault("subtitleLanguageCode")
              )
                ? filterWord(word)
                : word,
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

export function shouldApplyWordFilter(
  subtitleLanguageCode: string | undefined
): boolean {
  return subtitleLanguageCode === "en" //for non english languages, we can't possibly know what weird characters exist in the language, so just don't bother.
}
