from timeit import default_timer as timer

import flask
from flask import request, send_file, jsonify

import cv2
import numpy as np
from datauri import DataURI

from application import server_detect

app = flask.Flask(__name__)


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
    json = server_detect(images)
    end = timer()
    print('Process took {:.2f}s to finish.'.format(end-start))

    return jsonify(json)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
