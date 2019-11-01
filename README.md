# Serverless Image Detection System

This is a project submission to HKUST COMP 4651 Cloud Computing. In this project, we aim to re-implement the [AWS Image Recognition Example](https://github.com/aws-samples/lambda-refarch-imagerecognition).

![](https://raw.githubusercontent.com/aws-samples/lambda-refarch-imagerecognition/master/images/photo-processing-backend-diagram.png)

## YoloV3
This acts as the `Amazon Rekognition` module in the system. The model is dockerised and may be built and deployed by:
1. `cd yolov3/`
2. `docker build -t yolo .`
3. `docker run -p 3000:3000 -d --name yolo yolo`

The module exposes the port `3000` that accepts a `GET` request with a `json` body like:
```json
{
  "images": [
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4Qh8RXhpZg...",
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAg..."
  ]
}
```
Sample data uris for testing can be found in `./yolov3/data/samples/*.b64`.

This module will later be deployed as a function on OpenFaaS.