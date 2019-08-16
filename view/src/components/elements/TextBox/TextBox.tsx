import React, { useState } from "react"
import "./TextBox.css"
import FileChooserButton from "../FileChooserButton/FileChooserButton"

export type TextBoxId = "channelId" | "textFileWords" | "textFileVideoSource"

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
  fileChooserType?: "file" | "folder"
  initialText: string
  isHidden?: boolean
  onFinishEditing?(event: React.ChangeEvent<HTMLInputElement>): void
  key: string //not used here, just to make sure we add a key when adding this element
}) => {
  const style = props.isHidden ? { display: "none" } : {}
  console.log("text box container rerender, style: ", style)

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
        readOnly={
          props.fileChooserType === "file" || props.fileChooserType === "folder"
        }
        onBlur={event => props.onFinishEditing && props.onFinishEditing(event)} //if it exists, then call it
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
