import React from "react"
import "./TextBox.css"
import FileChooserButton from "../FileChooserButton/FileChooserButton"

export type TextBoxId = "channelId" | "textFile"

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
  fileChooserType?: "file" | "folder"

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
