# For OpenFaaS
FROM openfaas/of-watchdog:0.7.2 as watchdog
FROM mhart/alpine-node:10
FROM apsl/thumbor as thumbor
FROM mhart/alpine-node:11 AS builder


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

COPY . .
RUN npm i

# Copy Files
USER app

# Set ownership
USER root
RUN chown -R app:app ./

USER app

# Start server
ENV fprocess="node server.js"
ENV cgi_headers="true"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:4000"

HEALTHCHECK --interval=5s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
