#!/bin/bash

set -e #stops script if any command fails

aws --endpoint-url=http://localhost:4566 cloudformation delete-stack \
    --stack-name pulse

aws --endpoint-url=http://localhost:4566 cloudformation deploy \
    --stack-name pulse \
    --template-file "./cdk.out/localstack.template.json"

aws --endpoint-url=http://localhost:4566 elbv2 describe-load-balancers \
    --query "LoadBalancers[0].DNSName" --output text

