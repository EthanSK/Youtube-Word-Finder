import { userDefaultsOnStart } from "../userDefaults"
export default async function findWords() {
  switch (userDefaultsOnStart.downloadOrder) {
    case "allMainThenAllAlt":
      handleAllMainThenAllAlt()
      break
    case "allMainWithAllAlt":
      handleAllMainWithAllAlt()
      break
    case "nextMainThenAllAlt":
      handleNextMainThenAllAlt()
      break
    case "nextMainThenNextAlt":
      handleNextMainThenNextAlt()
      break
  }
}

function handleAllMainThenAllAlt() {
  // for (let i = 0; i < userDefaultsOnStart.words.length; i++) {
  //     const element = array[i];
  // }
}
function handleAllMainWithAllAlt() {}
function handleNextMainThenAllAlt() {}
function handleNextMainThenNextAlt() {}
