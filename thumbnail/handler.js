'use strict'

const axios = require('axios')

const canvas = require('canvas')
const smartcrop = require('smartcrop')
const { Image, Canvas } = canvas

const width = 200, height = 200
//this is hacking the smartcrop library :)
global.document = {
  createElement: () => new Canvas(width, height)
}

const dataUrlHandler = (dataURL, callback) => {
  const image = new Image()
  image.onload = async () => {
    const { topCrop: crop } = await smartcrop.crop(image, { width, height })
    const canvas = new Canvas()
    canvas.height = height
    canvas.width = width
    let ctx = canvas.getContext('2d')
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const result = canvas.toDataURL()
    callback(result, { status: 'done' })
  }
  image.src = dataURL
}

const redisHandler = (key, callback) => {
  axios.get('http://127.0.0.1:31112/function/storage/'+key).then(({data: dataURL})=>{
    // console.log(result)
    console.log(dataURL.slice(0,10))
    dataUrlHandler(dataURL,callback)
  })
}

// https://gist.github.com/bgrins/6194623
const isDataURL = s => !!s.match(isDataURL.regex)
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i

const isRedisURL = s => true

const handler = (context, callback) => {
  if (typeof context === 'string') {
    if (isDataURL(context)) {
      return dataUrlHandler(context, callback)
    } else if (isRedisURL(context)) {
      return redisHandler(context, callback)
    }
  }
  callback('Incorrect input', { status: 'error' })
}

module.exports = handler
