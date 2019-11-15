#!/usr/bin/env bash
# shellcheck disable=SC2046

DIR=$(dirname "$0")

## Load dotenv values
#export $(egrep -v '^#' "${DIR}/../.env" | xargs)
#
#MSG="is not set. Please set up $(cd "${DIR}/.." || exit ; pwd)/.env before running this script!"
#
#if [[ -z "${MONGO_USER}" ]]; then
#  echo "MONGO_USER $MSG"
#  exit 1
#fi
#
#if [[ -z "${MONGO_PASSWORD}" ]]; then
#  echo "MONGO_PASSWORD $MSG"
#  exit 1
#fi

echo "Building dependency charts..."

helm dep build "${DIR}/../serverless-chart"

echo "Setting up Helm chart..."

helm install --namespace openfaas-fn --name serverless \
  "${DIR}/../serverless-chart"
#  --set mongodb.mongodbUsername=root \
#  --set mongodb.mongodbPassword=admin \
