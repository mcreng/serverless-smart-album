from timeit import default_timer as timer
import argparse

from flask import Flask, request, jsonify
from gevent.pywsgi import WSGIServer

import cv2
import numpy as np
import torch

from datauri import DataURI
from detect import detect

app = Flask(__name__)


@app.route('/', methods=['POST'])
def get_pred():
    """
    POST /
    Params:
        images (list): List of data uri specified images.
    Returns:
        Prediction in list of object, each object specifies the the two corners of the bounding box, the confidence level and the prediction.
    """

    start = timer()
    images = request.json['images']
    images = list(map(lambda b: DataURI(b), images))  # convert to datauri
    # filter only image
    images = list(filter(lambda uri: uri.mimetype[:5] == 'image', images))
    if len(images) == 0:
        return jsonify([])
    images = list(map(lambda uri: cv2.imdecode(np.frombuffer(
        uri.data, np.uint8), -1), images))  # convert to images
    with torch.no_grad():
        json = detect(images)
    end = timer()
    print('Process took {:.2f}s to finish.'.format(end-start))

    return jsonify(json)


if __name__ == '__main__':
    http_server = WSGIServer(('', 3000), app)
    http_server.serve_forever()
