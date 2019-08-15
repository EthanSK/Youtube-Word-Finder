import React from "react"
import "./SplitRow.css"

const SplitRow = (props: { children: any[] }) => {
  function createSections() {
    return props.children.map(child => {
      console.log("child key: ", child.key)
      return (
        <div className="splitRowSection" key={child.key}>
          {child}
        </div>
      )
    })
  }

  return <div className="splitRow">{createSections()}</div>
}

export default SplitRow

//apparently it's good practice to type children as any
