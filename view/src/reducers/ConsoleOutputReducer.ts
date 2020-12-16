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
  timestamp: number //Date obj cannot be stored as json i don't think
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
  instructionToFollow?: string //sends another console output with instruction type
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
    case "addNewMessage": //this isn't really used anywhere.
      const newPayload: ConsoleOutputPayload = {
        ...(action.payload as ConsoleOutputActionPayload),
        timestamp: Date.now(),
      }

      ipcSend("log-console-output", newPayload)
      return [...state, newPayload] //cut down it only when showing in console. don't wanna lose data.
    case "componentChanged": //things triggered by components. ie user default changes
      const payload = action.payload as ConsoleOutputComponentsPayload
      let newState = [...state]
      const generatedPayload = generateUserDefaultsActionPayload(payload)

      if (generatedPayload) {
        const newPayload: ConsoleOutputPayload = {
          ...generatedPayload!,
          timestamp: Date.now(),
        }
        ipcSend("log-console-output", newPayload)
        // return [...state, newPayload]
        newState.push(newPayload)
      }

      if (payload.instructionToFollow) {
        const secondPayload: ConsoleOutputPayload = {
          message: payload.instructionToFollow,
          messageType: "instruction",
          timestamp: Date.now(),
        }
        ipcSend("log-console-output", secondPayload)

        newState.push(secondPayload)
      }
      return newState
    default:
      return state
  }
}

function generateUserDefaultsActionPayload(
  consoleOutputOptions: ConsoleOutputComponentsPayload
): ConsoleOutputActionPayload | undefined {
  if (consoleOutputOptions.shouldOutput === false) return //only if defined and set to false, else default behaviour is to output

  let message: string
  if (consoleOutputOptions.value) {
    message = `Changed ${consoleOutputOptions.name} to ${consoleOutputOptions.value}`
  } else {
    message = `Removed ${consoleOutputOptions.name}`
  }
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
