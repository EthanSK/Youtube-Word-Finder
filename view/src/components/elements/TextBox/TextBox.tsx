import React, { ReactNode } from "react"
import "./TextBox.css"

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
  onFinishEditing(event: React.ChangeEvent<HTMLInputElement>): void
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const style = props.isHidden ? { display: "none" } : {}

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
        onBlur={event => props.onFinishEditing(event)}
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
