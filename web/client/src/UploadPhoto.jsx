import React, {useState} from 'react'
import ImageViewer from './ImageViewer'
import axios from 'axios'

export default ({ albumId, userName }) => {
  const [dataURL, setDataURL] = useState('')
  const [thumbnailDataURL, setThumbnailDataURL] = useState('')
  const [areas, setAreas] = useState([])
  const onFileSelect = ({target: {files}}) => {
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

  const onImageSelect = ({target: {files}}) => setFileSelected(files[0] || null)

  const upload = async () => {
    if (!fileSelected) {
      return
    }

    // Upload to storage and run chained functions
    // This is not mirroring AWS example, where they simply uploaded file to bucket and triggers a
    // backend event to initiate chained functions.
    const data = await readFile(fileSelected)
    try {
      const key = generateKey()
      await axios.post('/function/storage/incoming:' + key, {data})
      await axios.post('/function/photos', {
        albumId,
        userName,
        key: 'incoming:' + key
      })
      console.log('uploaded')
    } catch (e) {
      alert(e)
    }
  }

  return (
    <div>
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
