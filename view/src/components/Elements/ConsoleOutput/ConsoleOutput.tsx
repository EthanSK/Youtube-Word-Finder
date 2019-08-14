import React from "react"
import "./ConsoleOutput.css"

const ConsoleOutput = (props: { placeholder: string }) => {
  return (
    <textarea
      className="consoleOutput"
      placeholder={props.placeholder}
      readOnly={true}
    />
  )
}

export default ConsoleOutput
