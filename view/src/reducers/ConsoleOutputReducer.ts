import { ipcSend } from "../ipc"

export interface ConsoleOutputActionPayload {
  message: string
  messageType: ConsoleOutputMessageType
}

export type ConsoleOutputMessageType =
  | "instruction"
  | "info"
  | "error"
  | "loading"
  | "success"
  | "settings"
  | "sadtimes"
  | "startstop"

export interface ConsoleOutputPayload extends ConsoleOutputActionPayload {
  timestamp: Date
}

export type ConsoleOutputState = ConsoleOutputPayload[]

export interface ConsoleOutputAction {
  type: "addNewMessage" | "componentChanged"
  payload: ConsoleOutputActionPayload | ConsoleOutputComponentsPayload
}

/** 
 This is used in components such as dropdowns and text boxes so we don't have to manually do each one. We can override the default setting with the default output replacement, but otherwise, the default will be what the generateUserDefaultsActionPayload function does
 */
export interface ConsoleOutputComponentsPayload {
  shouldOutput?: boolean
  appendToMessage?: string
  name?: string
  value?: string
  //name and value have to be set if defaultOutputReplacement is not set
  defaultOutputReplacement?: {
    message?: string
    messageType?: ConsoleOutputMessageType
  }
}

const consoleOutputReducer = (
  state: ConsoleOutputState,
  action: ConsoleOutputAction
): ConsoleOutputState => {
  switch (action.type) {
    case "addNewMessage":
      const newPayload: ConsoleOutputPayload = {
        ...(action.payload as ConsoleOutputActionPayload),
        timestamp: new Date()
      }
      ipcSend("log-console-output", newPayload)
      return [...state, newPayload] //cut down it only when showing in console. don't wanna lose data.
    case "componentChanged":
      const generatedPayload = generateUserDefaultsActionPayload(
        action.payload as ConsoleOutputComponentsPayload
      )
      if (generatedPayload) {
        const newPayload: ConsoleOutputPayload = {
          ...generatedPayload!,
          timestamp: new Date()
        }
        ipcSend("log-console-output", newPayload)
        return [...state, newPayload]
      }
    default:
      return state
  }
}

function generateUserDefaultsActionPayload(
  consoleOutputOptions: ConsoleOutputComponentsPayload
): ConsoleOutputActionPayload | undefined {
  if (
    consoleOutputOptions.shouldOutput === false ||
    !consoleOutputOptions.value
  )
    return //only if defined and set to false, else default behaviour is to output
  let message = `Changed ${consoleOutputOptions.name} to ${
    consoleOutputOptions.value
  }`
  if (consoleOutputOptions.appendToMessage) {
    message += `. ${consoleOutputOptions.appendToMessage}`
  }
  let messageType: ConsoleOutputMessageType = "settings"

  if (consoleOutputOptions.defaultOutputReplacement) {
    if (consoleOutputOptions.defaultOutputReplacement.message) {
      message = consoleOutputOptions.defaultOutputReplacement.message
    }
    if (consoleOutputOptions.defaultOutputReplacement.messageType) {
      messageType = consoleOutputOptions.defaultOutputReplacement.messageType
    }
  }
  const payload: ConsoleOutputActionPayload = { message, messageType }
  return payload
}

export default consoleOutputReducer
