#!/bin/bash

HOSTNAME=$(hostname)
envsubst '${HOSTNAME}' < template.json > devcontainer.json