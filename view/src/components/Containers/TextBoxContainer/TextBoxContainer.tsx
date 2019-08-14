import React from "react"
import "./TextBoxContainer.css"

export type TextBoxId = "channelId"

const TextBoxContainer = (props: {
  textBoxId: TextBoxId
  labelText: string
  placeholder: string
}) => {
  return (
    <div className="textBoxContainer">
      <label className="textBoxLabel" htmlFor={props.textBoxId}>
        {props.labelText}
      </label>
      <input
        type="text"
        id={props.textBoxId}
        className="textBox"
        placeholder={props.placeholder}
      />
    </div>
  )
}

export default TextBoxContainer
