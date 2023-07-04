import Store from "electron-store"

const store = new Store()

export function save(key: string, value: any) {
  // console.log("store ", key, value)
  store.set(key, value)
  // store.clear()
}

export function load(key: string): any {
  const loadVal = store.get(key)
  // console.log("load val : ", loadVal)
  return loadVal
}
