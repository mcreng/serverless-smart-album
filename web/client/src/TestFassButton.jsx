import React, { useState } from 'react'

export default () => {
  const [innerText, setInnerText] = useState('Click to test OpenFaas Connection')
  const testConnection = () => {
    fetch('/function/echoit', {
      method: 'POST',
      body: 'connected to OpenFaas'
    }).then(d => d.text()).then(setInnerText)
  }
  return (
    <button onClick={testConnection}>{innerText}</button>
  )
}
