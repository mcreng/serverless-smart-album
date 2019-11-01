# For Python 3.6
FROM python:3.6

# Change Working Directory
WORKDIR /usr/src/app

# Fetch Trained Weights
ADD ./weights/download_yolov3_weights.sh ./weights/download_yolov3_weights.sh
RUN bash ./weights/download_yolov3_weights.sh

# Install Dependencies
RUN apt-get -y update && apt-get -y install cmake
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN pip install pycocotools
RUN pip install torch==1.3.0+cpu torchvision==0.4.1+cpu -f https://download.pytorch.org/whl/torch_stable.html

# Copy Files
COPY ./cfg ./cfg
COPY ./data ./data
COPY ./utils ./utils
COPY application.py .
COPY detect.py .
COPY models.py .
COPY server.py .

# Start Server
EXPOSE 3000
ENTRYPOINT ["python", "./server.py"]
