'use strict'

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

const connect = cb => context => {
  MongoClient.connect('mongodb://root:admin@serverless-mongodb.openfaas-fn:27017/?authMechanism=DEFAULT&authSource=serverless', function (err, client) {
    if (err) {
      context
        .status(500)
        .fail('MongoDB Err: ' + err)
    }
    cb(context, client.db('serverless'), client.close)
  });
}

const index = () => connect(async (context, db, close) => {
  const albums = db.collection('albums')
  context
    .status(200)
    .succeed(await albums.find({}).toArray())
  close()
})

const show = albumId => connect(async (context, db, close) => {
  const albums = db.collection('albums')
  const resultingAlbum = await albums.findOne({ _id: new ObjectId(albumId) })
  const photos = db.collection('photos')
  resultingAlbum.photos = await photos.find({albumId}).toArray()
  context
    .status(200)
    .succeed(resultingAlbum)
  close()
})

const store = ({ albumName, userName }) => connect(async (context, db, close) => {
  const albums = db.collection('albums')
  try {
    const result = await albums.insertOne({albumName, userName, createdAt: Date.now()})
    result.photos = []
    context.status(201).succeed(result.ops[0])
    close()
  } catch (e) {
    context.status(500).fail('Mongo Err:' + e)
  }
})

module.exports = (event, context) => {
  const path = event.path.split('/').filter(x => x !== '')

  context.headers({ 'Content-Type': 'application/json' })

  if (path.length === 0 && event.method === 'GET') {
    index()(context)
  } else if (path.length === 1 && event.method === 'GET') {
    show(path[0])(context)
  } else if (path.length === 0 && event.method === 'POST') {
    store(event.body)(context)
  } else {
    context
      .status(400)
      .fail('Bad Request')
  }
}
