#!/bin/bash

# 傳統服務器部署腳本 (SSH 方式)
# 需要預先設置：SSH 金鑰、服務器環境

set -e

# 服務器配置
SERVER_USER="${DEPLOY_USER:-ubuntu}"
SERVER_HOST="${DEPLOY_HOST:-your-server.com}"
SERVER_PATH="${DEPLOY_PATH:-/opt/crypto-place}"
SSH_KEY="${SSH_KEY_PATH:-~/.ssh/id_rsa}"

echo "🖥️ 開始服務器部署..."
echo "目標服務器: $SERVER_USER@$SERVER_HOST"
echo "部署路徑: $SERVER_PATH"

# 1. 測試 SSH 連接
echo "🔐 測試 SSH 連接..."
ssh -i $SSH_KEY -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo '✅ SSH 連接成功'"

# 2. 在服務器上執行部署
echo "🚀 在服務器上執行部署..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST << EOF
set -e

echo "📂 切換到部署目錄..."
cd $SERVER_PATH

echo "📦 拉取最新代碼..."
git pull origin main

echo "🔄 重啟服務..."
./scripts/deploy.sh production

echo "✅ 服務器部署完成！"
EOF

# 3. 驗證部署
echo "🔍 驗證部署..."
sleep 10

# 檢查前端
if curl -f -s -o /dev/null --max-time 10 "http://$SERVER_HOST:3001"; then
    echo "✅ 前端服務運行正常"
else
    echo "❌ 前端服務異常"
fi

# 檢查後端
if curl -f -s -o /dev/null --max-time 10 "http://$SERVER_HOST:5001/api/health"; then
    echo "✅ 後端服務運行正常"
else
    echo "❌ 後端服務異常"
fi

echo "✅ 服務器部署並驗證完成！"