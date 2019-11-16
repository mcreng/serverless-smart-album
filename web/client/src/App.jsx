import React, { useState } from 'react'
import './App.css'
import TestFassButton from './TestFassButton'
import ImageViewer from './ImageViewer'
import axios from 'axios'

export default () => {
  const [dataURL, setDataURL] = useState('')
  const [thumbnailDataURL, setThumbnailDataURL] = useState('')
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
      fetch('/function/thumbnail', {
        method: 'POST',
        body: reader.result
      }).then(res => res.text()).then(text => {
        setThumbnailDataURL(text)
      })
    }, false)

    if (files.length > 0) {
      reader.readAsDataURL(files[0])
    }
  }

  const [fileSelected, setFileSelected] = useState(null)
  const [albumId, setAlbumId] = useState('defaultAlbum')
  const [userName, setUserName] = useState('defaultUser')

  const generateKey = () => {
    return ("" + new Date().getTime()).split("").reverse().join("")
      + "-" + albumId
      + "-" + fileSelected.name;
  }

  const readFile = async file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject()
    reader.readAsDataURL(file)
  })

  const onImageSelect = ({ target: { files } }) => setFileSelected(files[0] || null)

  const upload = async () => {
    if (!fileSelected) {
      return
    }

    // Upload to storage and run chained functions
    // This is not mirroring AWS example, where they simply uploaded file to bucket and triggers a
    // backend event to initiate chained functions.
    const data = await readFile(fileSelected)
    try {
      await axios.post('/function/photos', {
        albumId,
        userName,
        data,
        name: fileSelected.name
      })
      console.log('uploaded')
    } catch (e) {
      alert(e)
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
      {thumbnailDataURL && <img src={thumbnailDataURL}/>}
      <hr/>
      <label>Test process upload</label>
      <input type="file" onChange={onImageSelect}/>
      <button type="button" onClick={upload}>Upload</button>
    </div>
  )
}
