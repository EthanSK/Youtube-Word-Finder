interface ConsoleOutputActionPayload {
  message: string
  messageType: ConsoleOutputMessageType
}

export type ConsoleOutputMessageType =
  | "instruction"
  | "info"
  | "error"
  | "loading"
  | "success"
  | "userDefault"
  | "sadtimes"
  | "startstop"

interface ConsoleOutputPayload extends ConsoleOutputActionPayload {
  timestamp: Date
}

export type ConsoleOutputState = ConsoleOutputPayload[]

export type ConsoleOutputAction = {
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
      return [...state, newPayload] //cut down it only when showing in console. don't wanna lose data.
    default:
      return state
  }
}

export default consoleOutputReducer
