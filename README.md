# Serverless Image Detection System

This is a project submission to HKUST COMP 4651 Cloud Computing. In this project, we aim to re-implement the [AWS Image Recognition Example](https://github.com/aws-samples/lambda-refarch-imagerecognition).

![](https://raw.githubusercontent.com/aws-samples/lambda-refarch-imagerecognition/master/images/photo-processing-backend-diagram.png)

## Yolov3

This acts as the `Amazon Rekognition` module in the system. The model is dockerised and may be built and deployed by:

1. `cd yolov3/`
2. `docker build -t yolo .`
3. `docker run -p 3000:3000 -d --name yolo yolo`

The module exposes the port `3000` that accepts a `POST` request with a `json` body like:

```javascript
{
  "images": [
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4Qh8RXhpZg...",
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAg...",
    // ...
  ]
}
```

Sample data uris for testing can be found in `./yolov3/data/samples/*.b64`.

`Yolov3` can also be deployed to `OpenFaaS` by doing `faas-cli up` at root folder.
