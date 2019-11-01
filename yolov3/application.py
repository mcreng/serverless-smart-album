import argparse

import torch
from detect import detect


def server_detect(images):
    parser = argparse.ArgumentParser()
    parser.add_argument('--cfg', type=str,
                        default='cfg/yolov3-tiny.cfg', help='cfg file path')
    parser.add_argument('--data', type=str,
                        default='data/coco.data', help='coco.data file path')
    parser.add_argument('--weights', type=str,
                        default='weights/yolov3-tiny.weights', help='path to weights file')
    # input file/folder, 0 for webcam
    parser.add_argument('--source', type=str,
                        default='data/samples', help='source')
    parser.add_argument('--output', type=str, default='output',
                        help='output folder')  # output folder
    parser.add_argument('--img-size', type=int, default=416,
                        help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float,
                        default=0.3, help='object confidence threshold')
    parser.add_argument('--nms-thres', type=float, default=0.5,
                        help='iou threshold for non-maximum suppression')
    parser.add_argument('--fourcc', type=str, default='mp4v',
                        help='output video codec (verify ffmpeg support)')
    parser.add_argument('--half', action='store_true',
                        help='half precision FP16 inference')
    parser.add_argument('--device', default='',
                        help='device id (i.e. 0 or 0,1) or cpu')
    parser.add_argument('--view-img', action='store_true',
                        help='display results')
    opt = parser.parse_args()

    with torch.no_grad():
        return detect(opt, images)
