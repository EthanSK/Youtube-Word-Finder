import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App/App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import ViewManager from "./ViewManage"

ReactDOM.render(
  <BrowserRouter>
    <ViewManager />
  </BrowserRouter>,
  document.getElementById("root")
)
