import React from "react"
import "./TextBox.css"
import FileChooserButton from "../FileChooserButton/FileChooserButton"

export type TextBoxId = "channelId" | "textFileWords" | "textFileVideoSource"

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
  fileChooserType?: "file" | "folder"
  initialText: string
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  return (
    <div className="textBoxContainer" key={props.textBoxId}>
      <label className="textBoxLabel" htmlFor={props.textBoxId}>
        {props.labelText}
      </label>
      <input
        type="text"
        id={props.textBoxId}
        className="textBox"
        placeholder={props.placeholder}
        readOnly={
          props.fileChooserType === "file" || props.fileChooserType === "folder"
        }
        onBlur={event => props.onChange && props.onChange(event)}
        defaultValue={props.initialText}
      />
      {(function() {
        if (props.fileChooserType) {
          return <FileChooserButton fileChooserType={props.fileChooserType} />
        }
        return null
      })()}
    </div>
  )
}

export default TextBoxContainer
