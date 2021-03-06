import React, {useState} from 'react'
import axios from 'axios'

export default ({ setScene, setSharedData, sharedData }) => {

  const [newAlbumName, setNewAlbumName] = useState('')

  const newAlbum = async () => {
    const albumName = newAlbumName.trim()
    if (albumName !== '') {
      try {
        const album = (await axios.post('/function/albums', {
          userName: sharedData.userName,
          albumName
        })).data
        setSharedData({
          album
        })
        setScene('album')
      } catch (e) {
        alert(e)
      }
    }
  }

  const selectAlbum = albumId => async () => {
    try {
      const album = (await axios.get('/function/albums/' + albumId)).data
      setSharedData({
        album
      })
      setScene('album')
    } catch (e) {
      alert(e)
    }
  }

  const renderedAlbums = sharedData.albums.map(({_id, albumName, userName}) => (
    <div className="col mb-4" key={_id}>
      <a href="#" onClick={selectAlbum(_id)}>
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
    <div className="mt-4 container">
      <h1 className="mb-3">Albums</h1>
      <div className="input-group mb-4">
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
