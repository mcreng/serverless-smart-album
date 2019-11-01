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
        time (str): Time in yyyy-mm-ddThh:mm specifying the first image to read. Consequently, the prediction would start after IN_LEN frames from start_datetime.
    Returns:
        Prediction in mp4 as specified.
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
