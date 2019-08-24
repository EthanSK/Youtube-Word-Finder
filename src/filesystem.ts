import fs from "fs"
import { userDefaultsOnStart } from "./userDefaults"
import path from "path"
import constants from "./constants"

function createDirIfNeeded(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export type WorkspaceDir = "mainDir" | "tempDir" | "subtitlesDir"

export function getDirName(dir: WorkspaceDir): string {
  switch (dir) {
    case "mainDir":
      return path.join(
        userDefaultsOnStart.outputLocation,
        userDefaultsOnStart.outputFolderName
      )
    case "tempDir":
      return path.join(getDirName("mainDir"), constants.folderNames.temp)
    case "subtitlesDir":
      return path.join(getDirName("tempDir"), constants.folderNames.subtitles)
  }
}

export function createWorkspaceFilesystem() {
  // createDirIfNeeded(userDefaultsOnStart.outputLocation) //shourdn't need to do this, they should have selected a dir that exists already

  createDirIfNeeded(getDirName("mainDir"))
  createDirIfNeeded(getDirName("tempDir"))
  createDirIfNeeded(getDirName("subtitlesDir"))
}
