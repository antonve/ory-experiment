# -*- mode: Python -*-

# Extensions
load('ext://helm_remote', 'helm_remote')

# Infra
include('./gateway/Tiltfile')
include('./ory/Tiltfile')

# Tools
k8s_yaml('./tools/deployments/pgweb.yaml')

# Services

# Frontend
