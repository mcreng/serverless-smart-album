import React, { useState } from 'react'
import './App.css'
import TestFassButton from './TestFassButton'
import ImageViewer from './ImageViewer'

export default () => {
  const [dataURL, setDataURL] = useState('')
  const [areas, setAreas] = useState([])
  const onFileSelect = ({ target: { files } }) => {
    const reader = new FileReader()
    reader.addEventListener('load', function () {
      setDataURL(reader.result)
      fetch('/function/yolov3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          images: [reader.result]
        })
      }).then(res => res.json()).then(json => {
        setAreas(json[0])
      })
    }, false)

    if (files.length > 0) {
      reader.readAsDataURL(files[0])
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      <TestFassButton/>
      <input type="file" onChange={onFileSelect}/>
      {dataURL && <ImageViewer src={dataURL} areas={areas}/>}
    </div>
  )
}
