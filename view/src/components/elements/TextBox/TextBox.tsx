import React, { ReactNode, useContext, useEffect, useRef } from "react"
import "./TextBox.css"
import { ConsoleOutputComponentsPayload } from "../../../reducers/ConsoleOutputReducer"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

//add new strings to union as needed
export type TextBoxId =
  | "videosChannelId"
  | "videosPlaylistId"
  | "textFileWords"
  | "textFileVideoSource"
  | "outputLocation"
  | "wordsToFind"
  | "outputFolderName"
  | "paddingToAdd"
  | "maxNumberOfVids"
  | "numberOfWordReps"

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
  fileChooser?: ReactNode
  initialText?: string
  isHidden?: boolean
  consoleOutputOptions: {
    useDefaultIfUndefined: boolean
    payload?: ConsoleOutputComponentsPayload
  }
  numberInputOptions?: {
    min: number
    max: number
    step: number
    isInt?: boolean
  }
  onFinishEditing?(event: React.ChangeEvent<HTMLInputElement>): void //optional because if its a file chooser, we don't let user edit the text box anyway
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)
  const { dispatch: consoleOutputDispatch } = useContext(ConsoleOutputContext)

  const style = props.isHidden ? { display: "none" } : {}

  function consoleOutput(event: React.ChangeEvent<HTMLInputElement>) {
    if (props.fileChooser) return //the finish event comes from the file chooser itself
    let payload = props.consoleOutputOptions.payload
    if (!payload) payload = {}
    if (props.consoleOutputOptions.useDefaultIfUndefined) {
      if (payload.name === undefined) payload.name = props.labelText
    }
    payload.value = event.target.value //must always update with new value otherwise it will stay stuck at old val
    if (
      props.numberInputOptions &&
      payload.value &&
      props.numberInputOptions.isInt
    ) {
      const num = Math.round(parseInt(event.target.value))
      // console.log("num: ", num)
      const max = Math.max(props.numberInputOptions!.min, num)
      const min = Math.min(max, props.numberInputOptions!.max)
      payload.value = min.toString()
    }

    consoleOutputDispatch({ type: "componentChanged", payload })
  }

  const textBoxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollLeft = textBoxRef.current.scrollWidth //always scroll to right because much more useful to see file and folder name as opposed to beginning of path
    }
  })

  return (
    <div
      className="textBoxContainer"
      // key={props.textBoxId + userDefaultsState.hasUserDefaultsLoaded} //so we can reset the initial value. this breaks things like file text boxes because it doesn't change while the key is the same.
      style={style}
    >
      <label className="textBoxLabel" htmlFor={props.textBoxId}>
        {props.labelText}
      </label>
      <input
        ref={textBoxRef}
        type={props.numberInputOptions === undefined ? "text" : "number"}
        step={props.numberInputOptions && props.numberInputOptions.step}
        min={props.numberInputOptions && props.numberInputOptions.min}
        max={props.numberInputOptions && props.numberInputOptions.max}
        id={props.textBoxId}
        className="textBox homePageTextBox"
        placeholder={props.placeholder}
        readOnly={props.fileChooser !== undefined}
        onBlur={event => {
          consoleOutput(event)
          props.onFinishEditing && props.onFinishEditing(event)
        }}
        onKeyPress={event => {
          if (event.key === "Enter") {
            event.currentTarget.blur()
          }
        }}
        defaultValue={props.initialText} //doesn't accept input if using just value
      />
      {(function() {
        if (props.fileChooser) {
          return props.fileChooser
        }
        return null
      })()}
    </div>
  )
}

export default TextBoxContainer
