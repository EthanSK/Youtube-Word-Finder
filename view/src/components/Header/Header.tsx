import "./Header.css"
import React, { useEffect } from "react"

const Header = (props: { title: string }) => {
  return (
    <div className="titleContainer">
      <h1>{props.title}</h1>
    </div>
  )
}

export default Header
