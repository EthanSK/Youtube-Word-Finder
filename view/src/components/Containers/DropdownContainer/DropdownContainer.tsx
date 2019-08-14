import React from "react"
import "./DropdownContainer.css"

export type SelectId = "videoSource"

type Option = { value: string; text: string; isSelected?: boolean }

const DropdownContainer = (props: {
  selectId: SelectId
  labelText?: string
  options: Option[]
}) => {
  function createOptionElems(options: Option[]) {
    return options.map(option => {
      return (
        <option value={option.value} selected={option.isSelected}>
          {option.text}
        </option>
      )
    })
  }

  return (
    <div className="dropdownContainer">
      <label className="dropdownLabel" htmlFor={props.selectId}>
        {props.labelText}
      </label>
      <select className="dropdown" id={props.selectId}>
        {createOptionElems(props.options)}
      </select>
    </div>
  )
}

export default DropdownContainer
