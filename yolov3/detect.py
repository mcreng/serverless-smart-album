from sys import platform

import pandas as pd
from models import * 
from utils.datasets import *
from utils.utils import *

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

# (320, 192) or (416, 256) or (608, 352) for (height, width)
img_size = opt.img_size
weights, half = opt.weights, opt.half

# Initialize
device = torch_utils.select_device(opt.device)

# Initialize model
model = Darknet(opt.cfg, img_size)

# Load weights
attempt_download(weights)
if weights.endswith('.pt'):  # pytorch format
    model.load_state_dict(torch.load(
        weights, map_location=device)['model'])
else:  # darknet format
    _ = load_darknet_weights(model, weights)
# Eval mode
model.to(device).eval()

# Half precision
half = half and device.type != 'cpu'  # half precision only supported on CUDA
if half:
    model.half()

def detect(images, save_txt=False, save_img=False):
    # Set Dataloader
    dataset = LoadImages(images, img_size=img_size, half=half)

    # Get classes and colors
    classes = load_classes(parse_data_cfg(opt.data)['names'])
    colors = [[random.randint(0, 255) for _ in range(3)]
              for _ in range(len(classes))]

    # Run inference
    preds = []
    t0 = time.time()
    for path, img, im0s, vid_cap in dataset:
        t = time.time()

        # Get detections
        img = torch.from_numpy(img).to(device)
        if img.ndimension() == 3:
            img = img.unsqueeze(0)
        pred = model(img)[0]

        if opt.half:
            pred = pred.float()

        # Apply NMS
        pred = non_max_suppression(pred, opt.conf_thres, opt.nms_thres)

        # Process detections
        for i, det in enumerate(pred):  # detections per image
            p, s, im0 = path, '', im0s

            # save_path = str(Path(out) / Path(p).name)
            s += '%gx%g ' % img.shape[2:]  # print string
            if det is not None and len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(
                    img.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += '%g %ss, ' % (n, classes[int(c)])  # add to string

        print('Done. (%.3fs)' % (time.time() - t0))
        df = pd.DataFrame.from_records(pred[0].numpy(), columns=['x1', 'y1', 'x2', 'y2', 'conf', 'unk', 'class']).drop(
            columns=['unk']).astype(dtype={'x1': 'int', 'y1': 'int', 'x2': 'int', 'y2': 'int'})
        df['class'] = df['class'].map(lambda c: classes[int(c)])
        preds.append(df.to_dict(orient='records'))

    return preds
