#!/bin/bash

# CD 實際部署腳本 - Docker Compose 方式
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "🚀 開始部署到 $ENVIRONMENT 環境..."
echo "使用配置文件: $COMPOSE_FILE"

# 1. 拉取最新代碼 (如果在服務器上)
if [ -d ".git" ]; then
    echo "📦 拉取最新代碼..."
    git pull origin main
fi

# 2. 停止現有服務
echo "🛑 停止現有服務..."
docker-compose -f $COMPOSE_FILE down

# 3. 清理舊映像檔 (可選)
echo "🧹 清理舊映像檔..."
docker system prune -f

# 4. 建置新映像檔
echo "🔨 建置新映像檔..."
docker-compose -f $COMPOSE_FILE build --no-cache

# 5. 啟動服務
echo "🚀 啟動服務..."
docker-compose -f $COMPOSE_FILE up -d

# 6. 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 30

# 7. 檢查服務狀態
echo "🔍 檢查服務狀態..."
docker-compose -f $COMPOSE_FILE ps

# 8. 運行健康檢查
echo "🏥 運行健康檢查..."
if [ -f "./scripts/health-check.sh" ]; then
    if [ "$ENVIRONMENT" = "production" ]; then
        ./scripts/health-check.sh "http://localhost:3001" "http://localhost:5001"
    else
        ./scripts/health-check.sh "http://localhost:3001" "http://localhost:5001"
    fi
else
    echo "⚠️ 健康檢查腳本不存在，跳過..."
fi

echo "✅ 部署完成！"
echo "🌐 前端訪問地址: http://localhost:3001"
echo "🔧 後端 API 地址: http://localhost:5001"

# 9. 顯示日誌 (可選)
echo "📋 顯示服務日誌..."
docker-compose -f $COMPOSE_FILE logs --tail=50