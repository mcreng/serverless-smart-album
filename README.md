# Serverless Image Detection System

This is a project submission to HKUST COMP 4651 Cloud Computing. In this project, we aim to re-implement the [AWS Image Recognition Example](https://github.com/aws-samples/lambda-refarch-imagerecognition).

![](https://raw.githubusercontent.com/aws-samples/lambda-refarch-imagerecognition/master/images/photo-processing-backend-diagram.png)

## Thumbnail
This is a thumbnail generator implemented in nodejs, using dockerfile to host express, the core is smartcropjs, which need canvas to polyfill a browser environment to have smartcropjs functional properly.

The thumbnail is build and deployed by

```shell script
faas-cli up --filter "thumbnail"
```

please pay attention that thumbnail takes a while (5min) to build since the canvas module is quite large

(lang dockerfile is used instead of node since using canvas module requires both python and node)

For development

```shell script
cd thumbnail

npm i

npm run dev
```

## Web
This is the user interface for the whole system, implemented in react and hosted as a function in OpenFaas

The web is built and deployed by

```shell script
faas-cli up --filter "recognition-web"
```

For development

The development server will proxy all request to OpenFaas server (see `web/client/package.json` proxy field)

```shell script
cd web/client

# install dependency
npm i

# start development server
npm run start
```


## Yolov3

This acts as the `Amazon Rekognition` module in the system. The model is dockerised and may be built and deployed by:

1. `cd yolov3/`
2. `docker build -t yolo .`
3. `docker run -p 3000:3000 -d --name yolo yolo`

The module exposes the port `3000` that accepts a `POST` request with a `json` body like:

```javascript
{
  "images": [ // these are IDs from redis
    "incoming:0164608455751-5de8ee343f0191000c80c507-bus.jpg", 
    "incoming:9264771555751-5de8ee343f0191000c80c507-zidane.jpg",
    // ...
   ]
}
```

The model would then return something like:

```json
[
  [
    {
      "class": "person",
      "conf": 0.9134646058082581,
      "x1": 36,
      "x2": 232,
      "y1": 397,
      "y2": 921
    },
    {
      "class": "person",
      "conf": 0.8966038227081299,
      "x1": 213,
      "x2": 366,
      "y1": 412,
      "y2": 827
    },
    {
      "class": "person",
      "conf": 0.7101491689682007,
      "x1": 692,
      "x2": 808,
      "y1": 515,
      "y2": 858
    },
    {
      "class": "bus",
      "conf": 0.5939806699752808,
      "x1": 0,
      "x2": 769,
      "y1": 208,
      "y2": 754
    }
  ],
  [
    {
      "class": "person",
      "conf": 0.9034249782562256,
      "x1": 720,
      "x2": 1152,
      "y1": 49,
      "y2": 706
    },
    {
      "class": "person",
      "conf": 0.4156661331653595,
      "x1": 121,
      "x2": 749,
      "y1": 170,
      "y2": 708
    }
  ]
]
```

Sample data uris for testing can be found in `./yolov3/data/samples/*.b64`.

This module can also be deployed to `OpenFaaS` by doing `faas-cli up` at root folder.
