#!/bin/bash
set -e

# # Configuration
PROJECT_ID="medical-perplexity"
REGION="asia-northeast1"  # Change to your preferred region
SERVICE_NAME="open-deep-research"
REPO_NAME="docker-images"
REPO_LOCATION="asia-northeast1"

# gcloud artifacts repositories create $REPO_NAME \
#   --repository-format=docker \
#   --location=$REGION \
#   --description="Docker repository for $SERVICE_NAME"

# 构建并推送 Docker 镜像
# export IMAGE_URI=asia-northeast1-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}
export IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest"
echo 构建并推送 Docker 镜像到 ${IMAGE_URI}
docker build --platform linux/amd64 -f Dockerfile -t ${IMAGE_URI} ./
docker push ${IMAGE_URI}

# 从本地 .env.local 文件读取环境变量
ENV_VARS=""
while IFS='=' read -r key value; do
  # 跳过空行和注释
  if [[ -z "$key" || "$key" == \#* ]]; then
    continue
  fi
  # 将环境变量添加到列表
  ENV_VARS="$ENV_VARS,$key=$value"
done < .env.local

# 去掉开头的逗号
ENV_VARS=${ENV_VARS:1}

# 修改脚本，为包含逗号的值添加引号


# 部署到 Cloud Run
echo "部署服务到 Cloud Run，使用现有环境变量"
gcloud run deploy $SERVICE_NAME \
  --image=${IMAGE_URI} \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --set-env-vars="$ENV_VARS" \
  --memory=512Mi


# 获取服务 URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

# 更新 NEXTAUTH_URL（如果需要）
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --set-env-vars="NEXTAUTH_URL=$SERVICE_URL"

echo "部署完成！您的服务现在可以通过以下 URL 访问:"
echo $SERVICE_URL