'use strict'

const MongoClient = require('mongodb').MongoClient
const axios = require('axios')

const connect = cb => context => {
  MongoClient.connect('mongodb://root:admin@serverless-mongodb.openfaas-fn:27017/?authMechanism=DEFAULT&authSource=serverless', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (err, client) {
    if (err) {
      context
        .status(500)
        .fail('MongoDB Err: ' + err)
    }
    cb(context, client.db('serverless'))
  });
}

const show = _id => connect(async (context, db) => {
  const photos = db.collection('photos')
  try {
    const photo = await photos.findOne({ _id })
    if (photo) {
      context
        .status(200)
        .succeed(photo)
    } else {
      context.status(404).fail('Not Found')
    }
  } catch (e) {
    context.status(500).fail('Mongo Err:' + e)
  }
})

const store = ({ albumId, userName, key }) => connect(async (context, db) => {
  const photos = db.collection('photos')
  try {
    // Run thumbnail
    const thumbnailKey = (await axios.post('http://gateway.openfaas:8080/function/thumbnail', key, {
      headers: { 'Content-Type': 'text/plain' }
    })).data

    // Run model
    const classifications = (await axios.post('http://gateway.openfaas:8080/function/yolov3', { images: [ key ] })).data
    const tags = [...new Set(classifications[0].map(result => result['class']))]

    // Insert to database
    const photo = await photos.insertOne({ albumId, userName, key, thumbnailKey, tags, createdAt: Date.now() })
    context.status(201).succeed(photo.ops[0])
  } catch (e) {
    context.status(500).fail('Err:' + e)
  }
})

module.exports = (event, context) => {
  const path = event.path.split('/').filter(x => x !== '')

  context.headers({ 'Content-Type': 'application/json' })

  if (path.length === 1 && event.method === 'GET') {
    show(path[0])(context)
  } else if (path.length === 0 && event.method === 'POST') {
    store(event.body)(context)
  } else {
    context
      .status(400)
      .fail('Bad Request')
  }
}
