import React, {useState} from 'react'
import ImageViewer from './ImageViewer'
import axios from 'axios'

export default ({ setSharedData, sharedData }) => {
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
      + "-" + sharedData.album._id
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
      const photo = (await axios.post('/function/photos', {
        albumId: sharedData.album._id,
        userName: sharedData.userName,
        key: 'incoming:' + key
      })).data
      setSharedData({
        album: {
          ...sharedData.album,
          photos: [
            ...sharedData.album.photos,
            photo
          ]
        }
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
      {thumbnailDataURL && <img src={thumbnailDataURL} alt="Thumbnail"/>}
      <hr/>
      <div className="form-inline">
        <label className="mr-2">Upload photo</label>
        <input type="file" onChange={onImageSelect}/>
        <button type="button" className="btn btn-primary" onClick={upload}>Upload</button>
      </div>
    </div>
  )
}
