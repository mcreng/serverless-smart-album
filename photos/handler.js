'use strict'

const MongoClient = require('mongodb').MongoClient

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

const show = _id => connect(async (context, db, close) => {
  const photos = db.collection('photos')
  try {
    const photo = await photos.findOne({ _id })
    if (photo) {
      context
        .status(200)
        .succeed(photo)
      close()
    } else {
      context.status(404).fail('Not Found')
    }
  } catch (e) {
    context.status(500).fail('Mongo Err:' + e)
  }
})

const store = ({ albumId, userName, key }) => connect(async (context, db, close) => {
  const photos = db.collection('photos')
  try {
    // Insert to database
    // TODO check existence of album with albumId
    const result = await photos.insertOne({ albumId, userName, incomingKey: key, createdAt: Date.now() })
    context.status(201).succeed(result.ops[0])
  } catch (e) {
    context.status(500).fail('Err:' + e)
  } finally {
    close()
  }

  // TODO 3. Check MIME type
  // 4. If OK, run model
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
