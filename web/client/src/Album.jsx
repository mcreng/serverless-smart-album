import React, {useState, useEffect, Fragment} from 'react'
import UploadPhoto from "./UploadPhoto";
import axios from 'axios';

export default ({ setScene, setSharedData, sharedData }) => {

  const photos = sharedData.album.photos || []
  const [renderedPhotos, setRenderedPhotos] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const renderedPhotos = await Promise.all(photos.map(async ({ key, createdAt, tags=[], thumbnailKey }) => {
        const data = (await axios.get('/function/storage/' + thumbnailKey)).data
        const renderedTags = tags.filter(x => x).map(name => <Fragment><span className="badge badge-primary">{ name }</span> </Fragment>)

        return (
          <div className="p-2">
            <div className="card" key={key}>
              <img className="card-img-top" src={data} alt={thumbnailKey}/>
              <div className="card-body p-2">
                <div>
                  <small className="text-muted">Tags </small>
                  { renderedTags.length > 0 ? renderedTags : <small><em>Nothing...</em></small> }
                </div>
                <div>
                  <div><small className="text-muted">Upload date </small></div>
                  <div><small>{(new Date(createdAt)).toLocaleString()}</small></div>
                </div>
              </div>
            </div>
          </div>
        )
      }))
      if (isSubscribed) {
        setRenderedPhotos(renderedPhotos)
      }
    })()
    return () => isSubscribed = false
  }, [sharedData])

  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4 mb-3">Album: {sharedData.album.userName}/{sharedData.album.albumName}</h1>
          <UploadPhoto setSharedData={setSharedData} sharedData={sharedData}/>
        </div>
      </div>
      <div className="container">
        <div className="my-4 row row-cols-2 row-cols-md-4 row-cols-lg-6">
          { renderedPhotos }
        </div>
      </div>
    </div>
  )
}
