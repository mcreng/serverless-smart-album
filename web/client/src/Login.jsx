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
    <div className="flex-fill d-flex flex-column">
      <div className="flex-fill"/>
      <div className="card">
        <div className="card-body">
          <h2>Login</h2>
          <div className="form-group">
            <input type="text" className="form-control" onChange={handleUserNameChange} placeholder="User Name"/>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-primary" onClick={login}>Login</button>
          </div>
        </div>
      </div>
      <div className="flex-fill"/>
    </div>
  )
}
