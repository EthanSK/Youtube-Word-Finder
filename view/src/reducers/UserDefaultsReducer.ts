import { ipcSend } from "../ipc";

export interface UserDefaultsAction {
  type: "set" | "restore" | "setWord";
  payload?: UserDefaultsState;
  wordPkg?: { arrIndex: number; word: Word };
}

const userDefaultsReducer = (
  state: UserDefaultsState,
  action: UserDefaultsAction
) => {
  let newState: UserDefaultsState;
  if (action.type === "setWord") {
    //ok, well this is a way better way than doing it every time outside the reducer...but it's too late now i already did it and cba to change every one. Just leave it here for reference, i think I used it in the handling word option text box changing, but that's it.
    let currentWords = state.words;
    if (!currentWords) currentWords = [];
    currentWords[action.wordPkg!.arrIndex] = action.wordPkg!.word;
    newState = { ...state, ...{ currentWords } };
  } else {
    newState = { ...state, ...action.payload }; //the last object spead takes priority for dup keys
  }

  if (action.type !== "restore") {
    ipcSend("save-user-default", action.payload);
  }

  // console.log("new state; ", newState)
  return newState; //override/set the new values got in action
};

export default userDefaultsReducer;
