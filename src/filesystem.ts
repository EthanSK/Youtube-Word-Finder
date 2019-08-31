import fs from "fs"
import {
  userDefaultsOnStart,
  loadUserDefault,
  createOutputName,
  userDefaultsKey
} from "./userDefaults"
import path from "path"
import constants from "./constants"
import del from "del"
import { load } from "./store"
import { saveUserDefault } from "./userDefaults"

export function createDirIfNeeded(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export type WorkspaceDir =
  | "mainDir"
  | "tempDir"
  | "metadataDir"
  | "wordsDir"
  | "wordsManuallyFoundDir"

export function getDirName(
  dir: WorkspaceDir,
  useUpdatedDefaults: boolean = false
): string {
  switch (dir) {
    case "mainDir":
      if (useUpdatedDefaults) {
        let outputFolderName = loadUserDefault("outputFolderName")
        if (!outputFolderName) {
          outputFolderName = createOutputName(load(userDefaultsKey))
        }
        return path.join(loadUserDefault("outputLocation"), outputFolderName)
      } else {
        let outputFolderName = userDefaultsOnStart.outputFolderName
        if (!outputFolderName) {
          outputFolderName = createOutputName(load(userDefaultsKey))
        }
        return path.join(userDefaultsOnStart.outputLocation!, outputFolderName)
      }

    case "tempDir":
      return path.join(
        getDirName("mainDir", useUpdatedDefaults),
        constants.folderNames.temp
      )
    case "metadataDir":
      return path.join(
        getDirName("tempDir", useUpdatedDefaults),
        constants.folderNames.metadata
      )
    case "wordsDir":
      return path.join(
        getDirName("mainDir", useUpdatedDefaults),
        constants.folderNames.words
      )
    case "wordsManuallyFoundDir":
      return path.join(
        getDirName("mainDir", useUpdatedDefaults),
        constants.folderNames.wordsManuallyFound
      )
  }
}

/**
 * returns absolute path of files
 */
export function getFilesInDir(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err)
      resolve(files.map(file => path.join(dir, file))) //return absolute file
    })
  })
}

export function createWorkspaceFilesystem(useUpdatedDefaults: boolean = false) {
  // createDirIfNeeded(userDefaultsOnStart.outputLocation) //shourdn't need to do this, they should have selected a dir that exists already

  createDirIfNeeded(getDirName("mainDir", useUpdatedDefaults))
  createDirIfNeeded(getDirName("tempDir", useUpdatedDefaults))
  createDirIfNeeded(getDirName("metadataDir", useUpdatedDefaults))
}

export function createYoutubeDlFilePath(
  dir: WorkspaceDir,
  fileName: "id" | "title",
  useUpdatedDefaults = false
): string {
  const ret = path.join(
    getDirName(dir, useUpdatedDefaults),
    `%(${fileName})s` //${Date.now().toString()}_
  )
  console.log(ret)
  return ret
}

export async function cleanupDirs(useUpdatedDefaults: boolean) {
  try {
    await del([getDirName("tempDir", useUpdatedDefaults)], { force: true }) //force is true because apparently the stupid fucking library throws an error when deleteing things outside the current working directory.
  } catch (error) {
    //don't do anything, coz im lazy . the error will prolly be something like there is no output location set...blah blah blah
  }
}
