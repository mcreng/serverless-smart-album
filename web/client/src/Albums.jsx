import React, {useState} from 'react'
import axios from 'axios'

export default ({ setScene, setSharedData, sharedData }) => {

  const [newAlbumName, setNewAlbumName] = useState('')

  const newAlbum = async () => {
    const albumName = newAlbumName.trim()
    if (albumName !== '') {
      try {
        const album = await axios.post('/function/albums', {
          userName: sharedData.userName,
          albumName
        }).data
        setSharedData({
          ...sharedData,
          album
        })
        setScene('album')
      } catch (e) {
        alert(e)
      }
    }
  }

  const selectAlbum = () => async albumId => {
    try {
      const album = await axios.get('/function/albums/' + albumId).data
      setSharedData({
        ...sharedData,
        album
      })
      setScene('album')
    } catch (e) {
      alert(e)
    }
  }

  const renderedAlbums = sharedData.albums.map(({_id, albumName, userName}) => (
    <div className="col mb-4">
      <a href="#" onClick={selectAlbum}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{albumName}</h5>
            <p className="card-text">By <em>{userName}</em></p>
          </div>
        </div>
      </a>
    </div>
  ))

  return (
    <div className="mt-4">
      <h1>Albums</h1>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="New Album Name" onChange={e => setNewAlbumName(e.target.value)}/>
        <div className="input-group-append">
          <button className="btn btn-secondary" type="button" onClick={newAlbum}>New Album</button>
        </div>
      </div>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
        { renderedAlbums }
      </div>
    </div>
  )
}
