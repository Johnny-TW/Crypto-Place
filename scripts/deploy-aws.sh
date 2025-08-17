#!/bin/bash

# AWS 雲端部署腳本
# 需要預先設置：AWS CLI、ECS、ECR、RDS

set -e

# AWS 配置
AWS_REGION="ap-northeast-1"  # 東京區域
ECR_REGISTRY="your-account-id.dkr.ecr.$AWS_REGION.amazonaws.com"
ECS_CLUSTER="crypto-place-cluster"
ECS_SERVICE="crypto-place-service"

echo "🌐 開始 AWS 部署..."

# 1. 登入 ECR
echo "🔐 登入 ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# 2. 建置並推送前端映像檔
echo "🏗️ 建置前端映像檔..."
docker build -t crypto-place-frontend ./frontend -f ./frontend/Dockerfile.prod
docker tag crypto-place-frontend:latest $ECR_REGISTRY/crypto-place-frontend:latest
docker push $ECR_REGISTRY/crypto-place-frontend:latest

# 3. 建置並推送後端映像檔
echo "🏗️ 建置後端映像檔..."
docker build -t crypto-place-backend ./backend
docker tag crypto-place-backend:latest $ECR_REGISTRY/crypto-place-backend:latest
docker push $ECR_REGISTRY/crypto-place-backend:latest

# 4. 更新 ECS 服務
echo "🔄 更新 ECS 服務..."
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION

# 5. 等待部署完成
echo "⏳ 等待部署完成..."
aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services $ECS_SERVICE \
  --region $AWS_REGION

echo "✅ AWS 部署完成！"