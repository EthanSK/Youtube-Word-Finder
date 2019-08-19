import Store from "electron-store"
import { ipcMain } from "electron"
import { ipcSend } from "./ipc"

const store = new Store()

const userDefaultsKey = "userDefaults"

ipcMain.on("save-user-default", (event, data) => {
  for (const key in data) {
    save(`${userDefaultsKey}.${key}`, data[key])
  }
})

export function restoreUserDefaults() {
  ipcSend("restore-user-defaults", load(userDefaultsKey))
}

export function save(key: string, value: any) {
  console.log("store val ", value)
  store.set(key, value)
}

export function load(key: string): any {
  return store.get(key)
}
