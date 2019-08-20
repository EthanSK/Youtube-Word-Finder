import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import App from "./components/App/App"

const ViewManager = () => {
  function views(): any {
    return {
      app: <App />
    }
  }

  function view(props: any) {
    let name = props.location.search.substr(1)
    let view = views()[name]
    if (view == null) throw new Error("View '" + name + "' is undefined")
    return view
  }

  return (
    <Router>
      <Route path="/" component={view} />
    </Router>
  )
}
export default ViewManager
