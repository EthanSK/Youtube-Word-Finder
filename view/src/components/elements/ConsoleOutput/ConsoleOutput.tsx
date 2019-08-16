import React, { useContext, useRef, useEffect } from "react"
import "./ConsoleOutput.css"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"
import { ConsoleOutputMessageType } from "../../../reducers/ConsoleOutputReducer"
import constants from "../../../constants"

const ConsoleOutput = (props: { placeholder: string }) => {
  const { state: consoleOutputState } = useContext(ConsoleOutputContext)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function emoji(messageType: ConsoleOutputMessageType) {
    switch (messageType) {
      case "instruction":
        return "👉"
      case "info":
        return "ℹ️"
      case "error":
        return "🛑"
      case "loading":
        return "⏳"
      case "success":
        return "✅"
      case "userDefault":
        return "⚙️"
      case "sadtimes":
        return "😭"
      case "startstop":
        return "🏁"
    }
  }
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
    }
  })
  function toDisplay(): string {
    const cutDownOutput = consoleOutputState.slice(
      -constants.maxConsoleOutputMessagesToDisplay
    ) //so the app doesn't lag out coz too many messages are showing in the console.
    let output = ""
    for (const payload of cutDownOutput) {
      output += `${output !== "" ? "\n\n" : ""}${emoji(payload.messageType)} ${
        payload.message
      }`
    }
    return output
  }

  return (
    <textarea
      className="consoleOutput"
      placeholder={props.placeholder}
      readOnly={true}
      value={toDisplay()}
      ref={textAreaRef}
    />
  )
}

export default ConsoleOutput
