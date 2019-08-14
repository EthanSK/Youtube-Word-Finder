import React, { ReactNode } from "react"
import "./SplitRow.css"

const SplitRow = (props: { children: any[] }) => {
  function createSections() {
    return props.children.map(child => {
      return <div className="splitRowSection">{child}</div>
    })
  }

  return <div className="splitRow">{createSections()}</div>
}

export default SplitRow

//apparently it's good practice to type children as any
