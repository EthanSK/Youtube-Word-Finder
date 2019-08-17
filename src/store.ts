import Store from "electron-store"
const store = new Store()

export function save(key: string, value: any) {
  store.set(key, value)
}

export function load(key: string): any {
  return store.get(key)
}
