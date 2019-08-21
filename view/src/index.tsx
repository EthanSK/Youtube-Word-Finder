import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ViewManager from "./ViewManager";
import UserDefaultsContextProvider, {
  UserDefaultsContext
} from "./contexts/UserDefaultsContext";
import { UserDefaultsState } from "./reducers/UserDefaultsReducer";
import { ipcSend } from "./ipc";
const { ipcRenderer } = window.require("electron");

const UserDefaults = () => {
  //because the ipc.on needs to be wrapped by the context provider
  const { dispatch: userDefaultsDispatch } = useContext(UserDefaultsContext);

  useEffect(() => {
    // console.log("send reque to restore defaults")
    ipcSend("restore-user-defaults"); //sending it here so it only requests when ready
    const channel = "restored-user-defaults";
    var handleUserDefaultRestore = function(
      event: Electron.IpcRendererEvent,
      data: UserDefaultsState
    ) {
      console.log("restoring: ", data);
      if (data) data.hasUserDefaultsLoaded = true;
      userDefaultsDispatch({ type: "restore", payload: data });
    };
    ipcRenderer.once(channel, handleUserDefaultRestore); //one time thing
  }, []); //only run on component did mount

  return null;
};

//entry point
ReactDOM.render(
  <BrowserRouter>
    <UserDefaultsContextProvider>
      <UserDefaults />

      <ViewManager />
    </UserDefaultsContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
