import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import TestFassButton from './TestFassButton'

export default () => {
  const [dataURL, setDataURL] = useState('')
  const onFileSelect = ({ target: { files } }) => {
    const reader = new FileReader()
    reader.addEventListener('load', function () {
      setDataURL(reader.result)
    }, false)

    if (files.length > 0) {
      reader.readAsDataURL(files[0])
    }
  }
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      <TestFassButton/>
      <input type="file" onChange={onFileSelect}/>
      {dataURL && <img src={dataURL} alt="selected"/>}
    </div>
  )
}
