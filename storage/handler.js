'use strict'

const redis = require('redis')
const client = redis.createClient({
  host: 'serverless-redis-master.openfaas-fn',
  password: 'admin'
})

const redisCb = context => (err, result) => {
  if (err) {
    context.status(500).fail(err)
  } else {
    context.status(200).succeed(result)
  }
}

const show = key => context => {
  client.get(key, redisCb(context))
}

const store = (key, data) => context => {
  client.set(key, data, redisCb(context))
}

module.exports = (event, context) => {
  const path = event.path.split('/').filter(x => x !== '')

  context.headers({ 'Content-Type': 'application/json' })

  if (path.length === 1 && event.method === 'GET') {
    show(path[0])(context)
  } else if (path.length === 1 && event.method === 'POST') {
    store(path[0], event.query.data)(context)
  } else {
    context
      .status(400)
      .fail('Bad Request')
  }
}
