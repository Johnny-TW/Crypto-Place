#!/bin/bash

# Vercel (前端) + Railway (後端) 部署方案
# 適合快速部署和測試

set -e

echo "🚀 開始雲端部署..."

# 1. 前端部署到 Vercel
echo "🌐 部署前端到 Vercel..."
cd frontend

# 安裝 Vercel CLI (如果沒有)
if ! command -v vercel &> /dev/null; then
    echo "📦 安裝 Vercel CLI..."
    npm install -g vercel
fi

# 建置前端
echo "🔨 建置前端..."
pnpm run build

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel --prod --yes

cd ..

# 2. 後端部署說明
echo "📋 後端部署步驟 (Railway)："
echo "   1. 前往 https://railway.app"
echo "   2. 連接您的 GitHub 倉庫"
echo "   3. 選擇 backend 目錄"
echo "   4. 設置環境變數："
echo "      - DATABASE_URL: Railway 提供的 PostgreSQL URL"
echo "      - NODE_ENV: production"
echo "      - PORT: 5001"
echo "   5. Railway 會自動部署"

echo "✅ 前端部署完成！"
echo "📋 請手動完成後端 Railway 部署"