import React, { ReactNode, useContext, useEffect, useRef } from "react"
import "./TextBox.css"
import { ConsoleOutputComponentsPayload } from "../../../reducers/ConsoleOutputReducer"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"

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

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
  fileChooser?: ReactNode
  initialText: string
  isHidden?: boolean
  consoleOutputOptions: {
    useDefaultIfUndefined: boolean
    payload?: ConsoleOutputComponentsPayload
  }
  numberInputOptions?: { min: number; max: number; step: number }
  onFinishEditing?(event: React.ChangeEvent<HTMLInputElement>): void //optional because if its a file chooser, we don't let user edit the text box anyway
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
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
    consoleOutputDispatch({ type: "componentChanged", payload })
  }

  const textBoxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollLeft = textBoxRef.current.scrollWidth //always scroll to right because much more useful to see file and folder name as opposed to beginning of path
    }
  })

  return (
    <div className="textBoxContainer" key={props.textBoxId} style={style}>
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
        className="textBox"
        placeholder={props.placeholder}
        readOnly={props.fileChooser !== undefined}
        onBlur={event => {
          consoleOutput(event)
          props.onFinishEditing && props.onFinishEditing(event)
        }}
        defaultValue={props.initialText} //breaks if using just value
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
