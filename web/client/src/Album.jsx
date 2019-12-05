import React, {useState, useEffect} from 'react'
import UploadPhoto from "./UploadPhoto";
import axios from 'axios';

export default ({ setScene, setSharedData, sharedData }) => {

  const photos = sharedData.album.photos || []
  const [renderedPhotos, setRenderedPhotos] = useState([]);

  useEffect(async () => {
    setRenderedPhotos(await Promise.all(photos.map(async ({ key, createdAt, tags=[] }) => {
      const data = (await axios.get('/function/storage/' + key)).data

      return (
        <div className="card">
          <div className="card-body">
            <img className="img-fluid" src={data} alt={key}/>
            <div>
              <strong>Tags:</strong>
              { tags.map(name => <span className="badge badge-primary">{ name }</span>) }
            </div>
            <div>
              <strong>Upload date:</strong>
              {(new Date(createdAt)).toLocaleString()}
            </div>
          </div>
        </div>
      )
    })))

    return () => {}
  }, [sharedData])

  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">Album: {sharedData.album.userName}/{sharedData.album.albumName}</h1>
          <UploadPhoto setSharedData={setSharedData} sharedData={sharedData}/>
        </div>
      </div>
      <div className="my-4 row row-cols-2 row-cols-md-3 row-cols-lg-4">
        { renderedPhotos }
      </div>
    </div>
  )
}
