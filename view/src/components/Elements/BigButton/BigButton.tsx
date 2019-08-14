import React from "react"
import "./BigButton.css"

const BigButton = (props: { title: string }) => {
  return <button className="bigButton">{props.title}</button>
}

export default BigButton
