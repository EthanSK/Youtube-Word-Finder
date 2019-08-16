import React from "react"
import "./Dropdown.css"

export type SelectId = "videoSource"
export type Option = {
  value: string
  isDefaultSelected?: boolean
}

const DropdownContainer = (props: {
  labelText?: string
  options: Option[]
  selectId: SelectId
  key: string //not used here, just to make sure we add a key when adding this element
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void //
}) => {
  return (
    <div className="dropdownContainer">
      <label className="dropdownLabel">{props.labelText}</label>
      <Dropdown
        options={props.options}
        selectId={props.selectId}
        onChange={event => props.onChange(event)}
      />
    </div>
  )
}

export default DropdownContainer

const Dropdown = (props: {
  selectId: SelectId
  options: Option[]
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void
}) => {
  function createOptionElems() {
    return props.options.map(option => {
      return (
        <option key={option.value} value={option.value}>
          {option.value}
        </option>
      )
    })
  }

  return (
    <select
      className="dropdown"
      id={props.selectId}
      defaultValue={
        props.options.filter(option => option.isDefaultSelected)[0].value
      }
      onChange={event => props.onChange(event)}
    >
      {createOptionElems()}
    </select>
  )
}
