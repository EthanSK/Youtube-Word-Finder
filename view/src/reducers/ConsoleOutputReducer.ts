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
  type: "addNewMessage"
  payload: ConsoleOutputActionPayload
}

const consoleOutputReducer = (
  state: ConsoleOutputState,
  action: ConsoleOutputAction
): ConsoleOutputState => {
  switch (action.type) {
    case "addNewMessage":
      let newPayload: ConsoleOutputPayload = {
        ...action.payload,
        timestamp: new Date()
      }
      ipcSend("log-console-output", newPayload)
      return [...state, newPayload] //cut down it only when showing in console. don't wanna lose data.
    default:
      return state
  }
}

export default consoleOutputReducer
