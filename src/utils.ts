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

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
