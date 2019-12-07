import React, {useState, useEffect, Fragment, useReducer} from 'react'
import UploadPhoto from "./UploadPhoto"
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'

export default ({ setScene, setSharedData, sharedData }) => {

  const photos = sharedData.album.photos || []
  const [renderedPhotos, setRenderedPhotos] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [imageData, setImageData] = useReducer((state, data) => ({
    ...state,
    ...data
  }), {})

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const renderedPhotos = await Promise.all(photos.map(async ({ key, createdAt, tags=[], thumbnailKey }) => {
        const thumbnailData = (await axios.get('/function/storage/' + thumbnailKey)).data
        const renderedTags = tags.filter(x => x).map(name => <Fragment key={key + name}><span className="badge badge-primary">{ name }</span> </Fragment>)
        const imageName = key.split(':')[1]
        axios.get('/function/storage/' + key).then(({ data }) => setImageData({ [imageName]: data }))

        return (
          <Fragment key={key}>
            <div className="p-2">
              <div className="card" onClick={() => setCurrentImage(imageName)}>
                <img className="card-img-top" src={thumbnailData} alt={thumbnailKey}/>
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
          </Fragment>
        )
      }))
      if (isSubscribed) {
        setRenderedPhotos(renderedPhotos)
      }
    })()
    return () => {isSubscribed = false}
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
      <Modal show={currentImage !== null} onHide={() => setCurrentImage(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentImage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img className="img-fluid" src={imageData[currentImage]} alt={currentImage} />
        </Modal.Body>
      </Modal>
    </div>
  )
}
