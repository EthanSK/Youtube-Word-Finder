import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"

const ChannelIdTextBox = (props: { key: string }) => {
  const {
    state: userDefaultsState,
    dispatch: userDefaultsDispatch
  } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="ChannelIdTextBox"
      textBoxId="channelId"
      labelText="Channel ID"
      placeholder="e.g. UCivXNaaNhyuQQO-0V9L6nFA"
      onChange={function(event) {
        const newText = event.target.value
        userDefaultsDispatch({
          channelId: newText
        })
      }}
      initialText={userDefaultsState.channelId}
    />
  )
}

export default ChannelIdTextBox
