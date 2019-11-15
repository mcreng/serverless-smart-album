'use strict'

const canvas = require('canvas')
const smartcrop = require('smartcrop')
const { Image, Canvas } = canvas

const width = 200, height = 200
//this is hacking the smartcrop library :)
global.document = {
  createElement: () => new Canvas(width,height)
}

module.exports = (context, callback) => {
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
  image.src = context
}

