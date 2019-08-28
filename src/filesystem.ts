import fs from "fs"
import { userDefaultsOnStart } from "./userDefaults"
import path from "path"
import constants from "./constants"
import del from "del"

export function createDirIfNeeded(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export type WorkspaceDir = "mainDir" | "tempDir" | "metadataDir" | "wordsDir"

export function getDirName(dir: WorkspaceDir): string {
  switch (dir) {
    case "mainDir":
      return path.join(
        userDefaultsOnStart.outputLocation!,
        userDefaultsOnStart.outputFolderName!
      )
    case "tempDir":
      return path.join(getDirName("mainDir"), constants.folderNames.temp)
    case "metadataDir":
      return path.join(getDirName("tempDir"), constants.folderNames.metadata)
    case "wordsDir":
      return path.join(getDirName("mainDir"), constants.folderNames.words)
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

export function createWorkspaceFilesystem() {
  // createDirIfNeeded(userDefaultsOnStart.outputLocation) //shourdn't need to do this, they should have selected a dir that exists already

  createDirIfNeeded(getDirName("mainDir"))
  createDirIfNeeded(getDirName("tempDir"))
  createDirIfNeeded(getDirName("metadataDir"))
}

export function createYoutubeDlFilePath(
  dir: WorkspaceDir,
  fileName: "id" | "title"
): string {
  const ret = path.join(
    getDirName(dir),
    `%(${fileName})s` //${Date.now().toString()}_
  )
  console.log(ret)
  return ret
}

export async function cleanupDirs() {
  del([getDirName("tempDir")])
}
