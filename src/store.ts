import Store from "electron-store"

const store = new Store()

export function save(key: string, value: any) {
  // console.log("store val ", value)
  store.set(key, value)
  // store.clear()
}

export function load(key: string): any {
  return store.get(key)
}
