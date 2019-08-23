import React, { useContext } from "react"
import DropdownContainer from "../../elements/Dropdown/Dropdown"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

export type DownloadOrder =
  | "allMainThenAllAlt"
  | "allMainWithAllAlt"
  | "nextMainThenAllAlt"
  | "nextMainThenNextAlt"

const DownloadOrderDropdown = (props: {
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <DropdownContainer
      key="DownloadOrderDropdown"
      consoleOutputOptions={{ useDefaultIfUndefined: true }}
      onChange={function(event) {
        const value: DownloadOrder = event.target.value as DownloadOrder
        userDefaultsDispatch({
          type: "set",
          payload: {
            downloadOrder: value
          }
        })
      }}
      selectId="videoSource"
      labelText="Download order"
      options={[
        {
          value: "All main words first then all alternatives",
          isSelected: userDefaultsState.downloadOrder === "allMainThenAllAlt",
          appendToMessage:
            "For each main word, it will download all it can for that word, then after all the main words are downloaded it will download all the alternative words it can"
        },
        {
          value: "All main words with all alternatives",
          isSelected: userDefaultsState.downloadOrder === "allMainWithAllAlt",
          appendToMessage:
            "For each main word, it will download all it can for that word, and then download all the alternative words it can for than main word, before moving onto the next word"
        },
        {
          value: "Next main word one at a time then all alternatives",
          isSelected: userDefaultsState.downloadOrder === "nextMainThenAllAlt",
          appendToMessage:
            "For each main word, it will download one occurrence of that word before moving to the next word, then it will repeat the process until it has downloaded all it can for the main words. Then after that, it will download all the alternative words for each word"
        },
        {
          value: "Next main word one at a time then next alternative",
          isSelected: userDefaultsState.downloadOrder === "nextMainThenNextAlt",
          appendToMessage:
            "For each main word, it will download one occurrence of that word before moving to the next word, then it will repeat the process until it has downloaded all it can for the main words. Then after that, for each main word, it will download one occurrence of the alternative words for that main word before moving to next main word's alternative word, and it will repeat until all the alternatives are downloaded"
        }
      ]}
    />
  )
}

export default DownloadOrderDropdown
