import React, { useState } from 'react'

export default ({ onLogin }) => {

  const [userName, setUserName] = useState('')

  const login = () => {
    const trimmedUserName = userName.trim()
    if (trimmedUserName !== '') {
      onLogin(trimmedUserName)
    }
  }

  const handleUserNameChange = (e) => {
    setUserName(e.target.value)
  }

  return (
    <div className="flex-fill d-flex flex-column container">
      <div className="flex-fill"/>
      <div className="row">
        <div className="card col-12 col-md-6 offset-md-3">
          <div className="card-body">
            <h2 className="mb-4">Login</h2>
            <div className="form-inline mb-2">
              <input type="text" className="form-control flex-fill" onChange={handleUserNameChange} placeholder="User Name"/>
              <button type="button" className="btn btn-primary ml-2" onClick={login}>Login</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-fill"/>
    </div>
  )
}
