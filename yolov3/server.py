from timeit import default_timer as timer
import argparse

import flask
from flask import request, send_file, jsonify

import cv2
import numpy as np
import torch

from datauri import DataURI
from detect import detect

app = flask.Flask(__name__)

class Object(object):
    pass

opt = Object()
opt.cfg = 'cfg/yolov3-tiny.cfg'
opt.data = 'data/coco.data'
opt.weights = 'weights/yolov3-tiny.weights'
opt.img_size = 416
opt.conf_thres = 0.3
opt.nms_thres = 0.5
opt.half = False
opt.device = ''

@app.route('/', methods=['GET'])
def get_pred():
    """
    Get /
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
        json = detect(opt, images)
    end = timer()
    print('Process took {:.2f}s to finish.'.format(end-start))

    return jsonify(json)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
