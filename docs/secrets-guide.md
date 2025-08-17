# GitHub Secrets 配置指南

## 📋 必要的 Secrets

前往 GitHub Repository → Settings → Secrets and variables → Actions

### 🐳 Docker Compose 部署

```bash
# 不需要額外 secrets，直接使用現有配置
```

### 🌐 AWS 部署

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-1
ECR_REGISTRY=your-account-id.dkr.ecr.ap-northeast-1.amazonaws.com
ECS_CLUSTER=crypto-place-cluster
ECS_SERVICE=crypto-place-service
```

### 🚀 Vercel + Railway 部署

```bash
VERCEL_TOKEN=your_vercel_token
RAILWAY_TOKEN=your_railway_token
```

### 🖥️ 服務器部署

```bash
DEPLOY_HOST=your-server.com
DEPLOY_USER=ubuntu
DEPLOY_PATH=/opt/crypto-place
SSH_PRIVATE_KEY=your_ssh_private_key_content
```

### 🔔 通知設置

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 🌍 環境變數

```bash
FRONTEND_URL=https://your-frontend.com
BACKEND_URL=https://your-backend.com
VITE_API_BASE_URL=https://your-backend.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

## 🔧 設置步驟

1. 前往 GitHub Repository
2. 點擊 Settings 標籤
3. 選擇 Secrets and variables → Actions
4. 點擊 New repository secret
5. 依次添加所需的 secrets

## 🚀 部署方式選擇

### 方案 1：Docker Compose (推薦新手)
- ✅ 簡單易用
- ✅ 適合小型專案
- ✅ 本地測試友好

### 方案 2：雲平台 (推薦生產環境)
- ✅ 自動擴展
- ✅ 高可用性
- ✅ 託管服務

### 方案 3：傳統服務器 (推薦自管)
- ✅ 完全控制
- ✅ 成本可控
- ✅ 客製化程度高