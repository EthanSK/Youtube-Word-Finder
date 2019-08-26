import fs from "fs"
import { userDefaultsOnStart } from "./userDefaults"
import path from "path"
import constants from "./constants"

function createDirIfNeeded(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export type WorkspaceDir = "mainDir" | "tempDir" | "metadataDir"

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
  }
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
  const ret = path.join(getDirName(dir), `%(${fileName})s`)
  console.log(ret)
  return ret
}
