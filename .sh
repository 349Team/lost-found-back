#! /bin/bash

# https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/

/home/alessandro/.fly/bin/flyctl

/home/alessandro/.fly/bin/flyctl auth logout
/home/alessandro/.fly/bin/flyctl auth login
/home/alessandro/.fly/bin/flyctl deploy


/home/alessandro/.fly/bin/flyctl apps destroy lost-found-api
/home/alessandro/.fly/bin/flyctl launch
