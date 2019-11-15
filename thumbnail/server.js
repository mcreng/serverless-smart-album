const express = require('express')
const app = express()

const handler = require('./handler')

app.use(express.text({limit: '500mb'}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.all('/*', (req, res) => {
  const { body } = req
  handler(body, ret => res.send(ret))
})

app.listen(4000, console.log({ test: 'started thumbnail' }))
