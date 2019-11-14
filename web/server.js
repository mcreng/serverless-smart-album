const express = require('express')
const app = express()
const fs = require('fs')

// app.get('/*',express.static("client/build"));

app.get('/*', (req, res) => {
  const { path } = req

  let headers = {
    'Content-Type': '',
  }
  if (/.*\.js/.test(path)) {
    headers['Content-Type'] = 'application/javascript'
  } else if (/.*\.css/.test(path)) {
    headers['Content-Type'] = 'text/css'
  } else if (/.*\.ico/.test(path)) {
    headers['Content-Type'] = 'image/x-icon'
  } else if (/.*\.json/.test(path)) {
    headers['Content-Type'] = 'application/json'
  } else if (/.*\.map/.test(path)) {
    headers['Content-Type'] = 'application/octet-stream'
  }

  let contentPath = `${__dirname}/client/build${path}`

  if (!headers['Content-Type']) {
    contentPath = `${__dirname}/client/build/index.html`
  }

  fs.readFile(contentPath, (err, data) => {
    if (err) {
      res
        .set(headers)
        .status(500)
        .send(err)

      return
    }

    let content = data.toString()

    res
      .set(headers)
      .status(200)
      .send(content)
  })
})

app.listen(4000, console.log({ test: 'started world' }))
