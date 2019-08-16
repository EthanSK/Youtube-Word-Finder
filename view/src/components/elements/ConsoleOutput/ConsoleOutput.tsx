import React, { useContext } from "react"
import "./ConsoleOutput.css"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"
import { ConsoleOutputMessageType } from "../../../reducers/ConsoleOutputReducer"
import constants from "../../../constants"

const ConsoleOutput = (props: { placeholder: string }) => {
  const { state: consoleOutputState } = useContext(ConsoleOutputContext)

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

  function toDisplay(): string {
    const cutDownOutput = consoleOutputState.slice(
      -constants.maxConsoleOutputMessagesToDisplay
    ) //so the app doesn't lag out coz too many messages are showing in the console.
    let output = ""
    for (const payload of cutDownOutput) {
      output += `${emoji(payload.messageType)} ${payload.message}\n\n`
    }
    return output
  }

  return (
    <textarea
      className="consoleOutput"
      placeholder={props.placeholder}
      readOnly={true}
      value={toDisplay()}
    />
  )
}

export default ConsoleOutput
