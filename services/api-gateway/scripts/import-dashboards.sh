#!/bin/bash

# Grafana credentials
GRAFANA_USER="admin"
GRAFANA_PASSWORD="admin"
GRAFANA_URL="http://localhost:3001"

# Create datasources
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://prometheus:9090",
    "access": "proxy",
    "basicAuth": false
  }' \
  "${GRAFANA_URL}/api/datasources" \
  -u "${GRAFANA_USER}:${GRAFANA_PASSWORD}"

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elasticsearch",
    "type": "elasticsearch",
    "url": "http://elasticsearch:9200",
    "access": "proxy",
    "basicAuth": false,
    "jsonData": {
      "esVersion": 8,
      "timeField": "@timestamp"
    }
  }' \
  "${GRAFANA_URL}/api/datasources" \
  -u "${GRAFANA_USER}:${GRAFANA_PASSWORD}"

# Import dashboards
for key in $(jq -r 'keys[]' ./src/config/grafana-dashboards.json); do
  dashboard=$(jq -r --arg key "$key" '.[$key].dashboard' ./src/config/grafana-dashboards.json)
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "{
      \"dashboard\": $dashboard,
      \"overwrite\": true
    }" \
    "${GRAFANA_URL}/api/dashboards/db" \
    -u "${GRAFANA_USER}:${GRAFANA_PASSWORD}"
done 