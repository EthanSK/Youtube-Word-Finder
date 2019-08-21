import React from "react"
import "./Button.css"

const Button = (props: {
  title: string
  class: "bigButton" | "mediumButton" | "smallButton" | "emojiButton"
  extraClasses?: string
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}) => {
  return (
    <button
      className={props.class + ` ${props.extraClasses}`}
      onClick={event => props.onClick(event)}
    >
      {props.title}
    </button>
  )
}

export default Button
