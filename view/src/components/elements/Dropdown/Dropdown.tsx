import React, { useContext } from "react"
import "./Dropdown.css"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import { ConsoleOutputContext } from "../../../contexts/ConsoleOutputContext"
import { ConsoleOutputComponentsPayload } from "../../../reducers/ConsoleOutputReducer"

export type SelectId = "videoSource"
export type Option = {
  value: string
  isSelected?: boolean
}

const DropdownContainer = (props: {
  labelText?: string
  options: Option[]
  selectId: SelectId
  consoleOutputOptions: {
    useDefaultIfUndefined: boolean
    payload?: ConsoleOutputComponentsPayload
  }
  key: string //not used here, just to make sure we add a key when adding this element
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void //
}) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)
  const { dispatch: consoleOutputDispatch } = useContext(ConsoleOutputContext)

  return (
    <div className="dropdownContainer">
      <label className="dropdownLabel">{props.labelText}</label>
      <Dropdown
        options={props.options}
        selectId={props.selectId}
        onChange={event => {
          let payload = props.consoleOutputOptions.payload
          if (!payload) payload = {}
          if (props.consoleOutputOptions.useDefaultIfUndefined) {
            if (payload.name === undefined) payload.name = props.labelText
            if (payload.value === undefined)
              payload.value = props.options.filter(
                option => option.isSelected
              )[0].value
          }
          consoleOutputDispatch({ type: "componentChanged", payload })
          props.onChange(event)
        }}
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
      value={props.options.filter(option => option.isSelected)[0].value}
      onChange={event => props.onChange(event)}
    >
      {createOptionElems()}
    </select>
  )
}
