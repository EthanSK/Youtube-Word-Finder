export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function removeFirstOccurrence(
  string: string,
  searchString: string
): string {
  var index = string.indexOf(searchString)
  if (index === -1) {
    return string
  }
  return string.slice(0, index) + string.slice(index + searchString.length)
}
