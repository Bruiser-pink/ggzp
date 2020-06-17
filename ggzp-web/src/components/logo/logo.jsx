import React from 'react'
import logo from './logo.png'
import './logo.css'

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="logo" className="logo-img" />
    </div>
  )
}
