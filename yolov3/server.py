import argparse

from flask import Flask, request, jsonify
from gevent.pywsgi import WSGIServer

import cv2
import numpy as np
import torch
from redis import Redis

from datauri import DataURI
from detect import detect

app = Flask(__name__)
r = Redis(host='serverless-redis-master.openfaas-fn', password='admin')


@app.route('/', methods=['POST'])
def get_pred():
    """
    POST /

    Params:
        images (list): List of IDs that points to images in redis.

    Returns:
        Prediction in list of object, each object specifies the the two corners of the bounding box, the confidence level and the prediction.
    """
    # get image list
    if 'images' in request.json:
        images = request.json['images']
    else:
        return jsonify([])

    # Convert keys to DataURIs through redis
    images = list(map(lambda s: r.get(s).decode(), images))

    # Convert strings to DataURIs
    images = list(map(lambda b: DataURI(b), images))

    # Filter out non-images
    images = list(filter(lambda uri: uri.mimetype[:5] == 'image', images))

    # Early return if no images are in list
    if len(images) == 0:
        return jsonify([])

    # Decode DataURI into np.ndarray
    images = list(map(lambda uri: cv2.imdecode(np.frombuffer(
        uri.data, np.uint8), -1)[:,:,:3], images))

    # Detect object in images
    with torch.no_grad():
        json = detect(images)

    return jsonify(json)


if __name__ == '__main__':
    http_server = WSGIServer(('', 3000), app)
    http_server.serve_forever()
