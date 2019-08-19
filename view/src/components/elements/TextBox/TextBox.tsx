import React, { ReactNode, useContext } from "react"
import "./TextBox.css"
import { ConsoleOutputComponentsPayload } from "../../../reducers/ConsoleOutputReducer"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"

export type TextBoxId =
  | "videosChannelId"
  | "videosPlaylistId"
  | "textFileWords"
  | "textFileVideoSource"

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
      if (payload.value === undefined) payload.value = event.target.value
    }
    consoleOutputDispatch({ type: "componentChanged", payload })
  }
  return (
    <div className="textBoxContainer" key={props.textBoxId} style={style}>
      <label className="textBoxLabel" htmlFor={props.textBoxId}>
        {props.labelText}
      </label>
      <input
        type="text"
        id={props.textBoxId}
        className="textBox"
        placeholder={props.placeholder}
        readOnly={props.fileChooser !== undefined}
        onBlur={event => {
          consoleOutput(event)
          props.onFinishEditing && props.onFinishEditing(event)
        }}
        defaultValue={props.initialText}
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
