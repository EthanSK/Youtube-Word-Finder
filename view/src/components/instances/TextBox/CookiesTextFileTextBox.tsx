import React, { useContext } from "react"
import TextBoxContainer from "../../elements/TextBox/TextBox"
import { UserDefaultsContext } from "../../../contexts/UserDefaultsContext"
import WordsToFindTextFileButton from "../FileChooserButton/WordsToFindTextFileChooser"
import CookiesTextFile from "../FileChooserButton/CookiesTextFile"

const CookiesTextFileTextBox = (props: { key: string }) => {
  const { state: userDefaultsState } = useContext(UserDefaultsContext)

  return (
    <TextBoxContainer
      key="CookiesTextFileTextBox"
      textBoxId="cookiesTextFile"
      labelText="Cookies text file"
      fileChooser={<CookiesTextFile />}
      allowManualInputFileChooser={true}
      placeholder="Optional: cookies.txt file exported from browser"
      initialText={userDefaultsState.cookiesTextFile}
      consoleOutputOptions={{
        useDefaultIfUndefined: true,
        payload: {
          instructionToFollow:
            "This is only if you are getting this error: HTTP Error 429: Too Many Requests or 402: Payment Required\n\nInstructions on getting the cookies file can be found here: https://github.com/ytdl-org/youtube-dl/blob/master/README.md#how-do-i-pass-cookies-to-youtube-dl or here: https://github.com/l1ving/youtube-dl#how-do-i-pass-cookies-to-youtube-dl",
        },
      }}
      //no onfinishediting here because it can't be edited, it is done in the file choose
    />
  )
}

export default CookiesTextFileTextBox
