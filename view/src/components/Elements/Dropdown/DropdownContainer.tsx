import React from "react"
import "./DropdownContainer.css"

export type SelectId = "videoSource"
export type Option = { value: string; text: string; isSelected?: boolean }

const DropdownContainer = (props: {
  labelText?: string
  options: Option[]
  selectId: SelectId
}) => {
  return (
    <div className="dropdownContainer">
      <label className="dropdownLabel">{props.labelText}</label>
      <Dropdown options={props.options} selectId={props.selectId} />
    </div>
  )
}

export default DropdownContainer

const Dropdown = (props: { selectId: SelectId; options: Option[] }) => {
  function createOptionElems() {
    return props.options.map(option => {
      return (
        <option value={option.value} selected={option.isSelected}>
          {option.text}
        </option>
      )
    })
  }

  return (
    <select className="dropdown" id={props.selectId}>
      {createOptionElems()}
    </select>
  )
}
