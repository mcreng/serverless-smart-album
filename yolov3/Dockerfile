# For OpenFaaS
FROM openfaas/of-watchdog:0.7.2 as watchdog
# For Python 3.6
FROM python:3.6

# Watchdog
COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Add non root user
RUN addgroup --system app && adduser --system --ingroup app app
RUN chown app /home/app
USER app
ENV PATH=$PATH:/home/app/.local/bin

# Change Working Directory
WORKDIR /home/app

USER root

# Fetch Trained Weights
ADD ./weights/download_yolov3_weights.sh ./weights/download_yolov3_weights.sh
RUN bash ./weights/download_yolov3_weights.sh

# Install python dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN pip install pycocotools
RUN pip install torch==1.3.0+cpu torchvision==0.4.1+cpu -f https://download.pytorch.org/whl/torch_stable.html

# Copy Files
USER app
COPY ./cfg ./cfg
COPY ./data ./data
COPY ./utils ./utils
COPY detect.py .
COPY models.py .
COPY server.py .

# Set ownership
USER root
RUN chown -R app:app ./

USER app

# Start server
ENV fprocess="python server.py"
ENV cgi_headers="true"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

HEALTHCHECK --interval=5s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]


# Start Server
# EXPOSE 3000
# CMD ["gunicorn", "-b", "0.0.0.0:3000", "server:app"]
