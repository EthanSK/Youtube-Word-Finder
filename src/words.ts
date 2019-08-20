import fs from "fs"
import { loadUserDefault } from "./store"

async function parseWordsTextFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(loadUserDefault("wordsToFindTextFile"), "utf8", (err, data) => {
      if (err) reject(err)
      else {
        resolve()
      }
    })
  })
}
