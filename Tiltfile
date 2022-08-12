# -*- mode: Python -*-

# Extensions
load('ext://helm_remote', 'helm_remote')

# Infra
helm_remote('postgres-operator',
            repo_name='postgres-operator',
            repo_url='https://opensource.zalando.com/postgres-operator/charts/postgres-operator/')

include('./gateway/Tiltfile')

# Tools
k8s_yaml('./tools/deployments/pgweb.yaml')
k8s_resource('pgweb', port_forwards=9000)

# Services

# Frontend
