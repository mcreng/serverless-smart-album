# Serverless Image Detection System

## Introduction

This is a project submission to HKUST COMP 4651 Cloud Computing. In this project, we aim to re-implement the [AWS Image Recognition Example](https://github.com/aws-samples/lambda-refarch-imagerecognition).

![](https://raw.githubusercontent.com/aws-samples/lambda-refarch-imagerecognition/master/images/photo-processing-backend-diagram.png)

Please view our report `report.pdf` for more information.

## Setup

This project is easily deployable to Kubernetes clusters.

1. Install OpenFaaS, if not present.
2. Setup a local docker repository, if not present. Change the repository host in `stack.yml` accordingly. Default if `localhost:32000`.
3. Setup the necessary helm services by `sh ./scripts/helm-up.sh`.
4. Deploy the functions by `faas-cli up`.

## Removal

This project is easily removable as well.

1. Remove the deployed functions by `faas-cli rm`.
2. Remove the helm services by `sh ./scripts/helm-down.sh`.
3. (Optional) Remove the local docker repository.
4. (Optional) Remove OpenFaaS.

## Modules Implemented

### Web

This function renders a static single page web application using React, interfacing with the user, allowing users to manage albums and photos. Requests are sent to other functions for processing via AJAX.

The web UI may be developed by:

```shell script
cd web/client

# install dependency
npm i

# start development server
npm run start
```

The development server will proxy all request to the OpenFaaS server (see `web/client/package.json` proxy field).

### Storage

This mirrors the AWS S3 service to allow users to upload and retrieve data in a key-value pair manner. This is implemented using a Redis instance. This function exposes a REST API endpoint:

- Show: Retrieve a value using a key from Redis

- Store: Update a key-value pair to Redis

### Albums

This function allows users to manage albums. This function exposes a REST API endpoint:

- Index: List all albums

- Show: Display details of one album by the album ID

- Store: Create a new album

### Photos

This function allows users to manage photos. This function exposes a REST API endpoint:

- Show: Display details of one photo by its ID

- Store: Create a new photo

### Thumbnail

This is a thumbnail generator function implemented using Nodejs smartcropjs library. To obtain a thumbnail, POST request the function with application/text header with a Redis key to the image or image Data URI as body, then the function returns a Redis key to the thumbnail or thumbnail Data URI respectively.

This may be developed by

```shell script
cd thumbnail

npm i

npm run dev
```

### Yolov3

This acts as the `Amazon Rekognition` module in the system. The model is dockerised and may be developed locally by:

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
