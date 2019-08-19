import React from "react"
import "./Button.css"

const Button = (props: {
  title: string
  style: "big" | "small"
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}) => {
  return (
    <button
      className={`${props.style}Button`}
      onClick={event => props.onClick(event)}
    >
      {props.title}
    </button>
  )
}

export default Button
