import React, {Fragment, useState} from 'react'
import Login from './Login'
import Albums from './Albums'
import Album from './Album'
import axios from 'axios'

export default () => {
  const [scene, setScene] = useState('login')
  const [sharedData, setSharedData] = useState({})

  const showAlbums = async () => {
    setSharedData({
      ...sharedData,
      albums: await axios.get('/function/albums').data
    })
    setScene('albums')
  }

  const onLogin = (userName) => {
    setSharedData({
      ...sharedData,
      userName
    })
    showAlbums()
  }

  return (
    <div>
      <header className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">
            Smart Album
          </span>
          {sharedData.userName &&
            <Fragment>
              <div>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={showAlbums}>Albums</a>
                </li>
              </div>
              <div className="ml-auto">
                <span className="navbar-text">Welcome, {sharedData.userName}!</span>
              </div>
            </Fragment>
          }
        </div>
      </header>
      <main className="container">
        {scene === 'login' && <Login onLogin={onLogin}/>}
        {scene === 'albums' && <Albums setScene={setScene} setSharedData={setSharedData} sharedData={sharedData}/>}
        {scene === 'album' && <Album setScene={setScene} setSharedData={setSharedData} sharedData={sharedData}/>}
      </main>
    </div>
  )
}
