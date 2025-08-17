#!/bin/bash

# 健康檢查腳本 - 檢查前端和後端服務狀態
# Usage: ./scripts/health-check.sh [frontend_url] [backend_url]

set -e

# 預設 URL
FRONTEND_URL=${1:-"http://localhost:3001"}
BACKEND_URL=${2:-"http://localhost:5001"}

echo "🔍 開始進行健康檢查..."
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"

# 檢查前端服務
echo "檢查前端服務..."
if curl -f -s -o /dev/null --max-time 10 "$FRONTEND_URL"; then
    echo "✅ 前端服務運行正常"
else
    echo "❌ 前端服務無法連接"
    exit 1
fi

# 檢查後端服務
echo "檢查後端服務..."
if curl -f -s -o /dev/null --max-time 10 "$BACKEND_URL/health" || curl -f -s -o /dev/null --max-time 10 "$BACKEND_URL/api/health"; then
    echo "✅ 後端服務運行正常"
else
    echo "❌ 後端服務無法連接"
    exit 1
fi

# 檢查後端 API 端點
echo "檢查後端 API 端點..."
if curl -f -s -o /dev/null --max-time 10 "$BACKEND_URL/api" || curl -f -s -o /dev/null --max-time 10 "$BACKEND_URL/api/crypto"; then
    echo "✅ 後端 API 運行正常"
else
    echo "⚠️  後端 API 可能無法正常運行"
fi

echo "✅ 健康檢查完成！"