# AWS 部署完整指南

## 📋 目錄
1. [AWS 服務選擇建議](#aws-服務選擇建議)
2. [方案 A: EC2 部署 (推薦入門)](#方案-a-ec2-部署)
3. [方案 B: ECS Fargate 部署 (推薦生產)](#方案-b-ecs-fargate-部署)
4. [CI/CD 整合](#cicd-整合)
5. [成本估算](#成本估算)

---

## 🎯 AWS 服務選擇建議

### 方案比較

| 方案 | 適合情境 | 月費用 (約) | 複雜度 | 擴展性 |
|------|---------|------------|--------|--------|
| **EC2 (t3.medium)** | 開發/測試/小型專案 | $30-40 | ⭐ 簡單 | ⭐⭐ 中等 |
| **ECS Fargate** | 生產環境 | $50-80 | ⭐⭐⭐ 複雜 | ⭐⭐⭐ 高 |
| **Lightsail** | 個人專案 | $10-20 | ⭐ 簡單 | ⭐ 低 |

**推薦**:
- 🎓 **學習/個人專案**: EC2 t3.micro (免費方案) 或 Lightsail
- 🚀 **生產環境**: ECS Fargate + RDS + CloudFront

---

## 方案 A: EC2 部署 (推薦入門)

### 優點:
- ✅ 配置簡單,類似 VM
- ✅ 成本可控
- ✅ 有 12 個月免費方案 (t2.micro/t3.micro)
- ✅ 完全控制權

### 步驟 1: 創建 EC2 實例

#### 1.1 登入 AWS Console
```
https://console.aws.amazon.com/
```

#### 1.2 啟動 EC2 實例

1. 進入 **EC2 Dashboard** → 點擊 **Launch Instance**

2. **配置實例**:
   ```
   名稱: crypto-place-server
   AMI: Ubuntu Server 22.04 LTS (免費方案)
   實例類型:
     - t2.micro (免費方案 - 1 vCPU, 1GB RAM)
     - t3.small (建議 - 2 vCPU, 2GB RAM, ~$15/月)
     - t3.medium (推薦 - 2 vCPU, 4GB RAM, ~$30/月)

   密鑰對: 創建新密鑰對 (crypto-place-key.pem) - 下載保存!

   網路設定:
     ✅ 允許 SSH (22)
     ✅ 允許 HTTP (80)
     ✅ 允許 HTTPS (443)
     ✅ 自訂 TCP (3001) - Frontend
     ✅ 自訂 TCP (5001) - Backend

   儲存: 20-30 GB gp3 (通用型 SSD)
   ```

3. 點擊 **Launch Instance**

#### 1.3 配置密鑰權限
```bash
# 在本地機器執行
chmod 400 ~/Downloads/crypto-place-key.pem
mv ~/Downloads/crypto-place-key.pem ~/.ssh/
```

#### 1.4 連線到 EC2
```bash
# 獲取 Public IP (從 EC2 Dashboard)
EC2_IP="your-ec2-public-ip"

# SSH 連線
ssh -i ~/.ssh/crypto-place-key.pem ubuntu@$EC2_IP
```

### 步驟 2: 設定 EC2 環境

```bash
# 2.1 更新系統
sudo apt update && sudo apt upgrade -y

# 2.2 安裝 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 2.3 安裝 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2.4 安裝 Git
sudo apt install -y git

# 2.5 重新登入使 Docker 權限生效
exit
ssh -i ~/.ssh/crypto-place-key.pem ubuntu@$EC2_IP

# 2.6 驗證安裝
docker --version
docker-compose --version
git --version
```

### 步驟 3: 部署專案

```bash
# 3.1 Clone 專案
cd ~
git clone https://github.com/Johnny-TW/Crypto-Place.git
cd Crypto-Place

# 3.2 創建環境配置
cat > .env.prd << EOF
NODE_ENV=production
POSTGRES_DB=crypto_place_prd
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
FRONTEND_PORT=3001
BACKEND_PORT=5001
VITE_API_BASE_URL=http://$EC2_IP:5001
VITE_API_HOST=/api
VITE_COINGECKO_API_KEY=your_api_key
EOF

# 3.3 部署
chmod +x scripts/deploy.sh
./scripts/deploy.sh production

# 3.4 驗證
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:3001
curl http://localhost:5001/api/health
```

### 步驟 4: 配置域名 (選配)

#### 4.1 在 Route 53 配置 DNS
```
1. 購買域名或使用現有域名
2. 創建 A 記錄指向 EC2 Public IP
3. 等待 DNS 傳播 (5-30 分鐘)
```

#### 4.2 設定 SSL (Let's Encrypt)
```bash
# 安裝 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 安裝 Nginx
sudo apt install -y nginx

# 配置 Nginx
sudo nano /etc/nginx/sites-available/crypto-place
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 啟用配置
sudo ln -s /etc/nginx/sites-available/crypto-place /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 獲取 SSL 證書
sudo certbot --nginx -d your-domain.com
```

---

## 方案 B: ECS Fargate 部署 (生產環境)

### 架構圖
```
┌─────────────────────────────────────────────────────┐
│ CloudFront (CDN) + Route 53 (DNS)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│ Application Load Balancer (ALB)                     │
│  ├─ Frontend Target Group (Port 80)                │
│  └─ Backend Target Group (Port 5001)               │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│ ECS Fargate Cluster                                 │
│  ├─ Frontend Service (ECS Task)                    │
│  └─ Backend Service (ECS Task)                     │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│ RDS PostgreSQL (Database)                           │
└─────────────────────────────────────────────────────┘
```

### 步驟 1: 創建 ECR (Container Registry)

```bash
# 1.1 安裝 AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# 1.2 配置 AWS CLI
aws configure
# 輸入:
#   AWS Access Key ID: [你的 Access Key]
#   AWS Secret Access Key: [你的 Secret Key]
#   Default region name: ap-northeast-1 (東京) 或 us-east-1 (維吉尼亞)
#   Default output format: json

# 1.3 創建 ECR repositories
aws ecr create-repository --repository-name crypto-place-frontend --region ap-northeast-1
aws ecr create-repository --repository-name crypto-place-backend --region ap-northeast-1

# 記錄輸出的 repositoryUri
```

### 步驟 2: 推送 Docker 映像到 ECR

```bash
# 2.1 登入 ECR
AWS_REGION="ap-northeast-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

# 2.2 建置並推送 Frontend
cd ~/Desktop/React-Project/Crypto-Place
docker build -t crypto-place-frontend -f frontend/Dockerfile.prod frontend/
docker tag crypto-place-frontend:latest $ECR_REGISTRY/crypto-place-frontend:latest
docker push $ECR_REGISTRY/crypto-place-frontend:latest

# 2.3 建置並推送 Backend
docker build -t crypto-place-backend backend/
docker tag crypto-place-backend:latest $ECR_REGISTRY/crypto-place-backend:latest
docker push $ECR_REGISTRY/crypto-place-backend:latest
```

### 步驟 3: 創建 RDS 資料庫

1. **進入 RDS Console** → **Create database**

2. **配置**:
   ```
   Engine: PostgreSQL 15
   Template: Free tier (開發) 或 Production (生產)

   DB instance identifier: crypto-place-db
   Master username: postgres
   Master password: [設定強密碼]

   Instance configuration:
     - Free tier: db.t3.micro (750 小時/月免費)
     - Production: db.t3.small 或 db.t3.medium

   Storage: 20-50 GB gp3

   Connectivity:
     - VPC: 預設 VPC
     - Public access: Yes (開發) 或 No (生產 + VPN)
     - VPC security group: 創建新的 (允許 5432)

   Database name: crypto_place_prd
   ```

3. **記錄連線資訊**:
   ```
   Endpoint: crypto-place-db.xxxxx.ap-northeast-1.rds.amazonaws.com
   Port: 5432
   ```

### 步驟 4: 創建 ECS Cluster 和 Task Definition

詳細的 Terraform 配置請參考 `infrastructure/aws/` 目錄 (即將創建)

---

## CI/CD 整合

### 設定 GitHub Secrets

1. 進入 GitHub Repository → **Settings** → **Secrets and variables** → **Actions**

2. 新增以下 Secrets:

#### EC2 部署 Secrets:
```
AWS_EC2_HOST: 你的 EC2 Public IP
AWS_EC2_USER: ubuntu
AWS_EC2_SSH_KEY: [EC2 私鑰內容,從 crypto-place-key.pem 複製]
AWS_EC2_PATH: /home/ubuntu/Crypto-Place
```

#### ECS 部署 Secrets:
```
AWS_ACCESS_KEY_ID: [從 IAM 獲取]
AWS_SECRET_ACCESS_KEY: [從 IAM 獲取]
AWS_REGION: ap-northeast-1
AWS_ACCOUNT_ID: [你的 AWS 帳號 ID]
ECR_REGISTRY: [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com
ECS_CLUSTER: crypto-place-cluster
ECS_SERVICE_FRONTEND: crypto-place-frontend-service
ECS_SERVICE_BACKEND: crypto-place-backend-service
```

#### 資料庫 Secrets:
```
POSTGRES_HOST: [RDS Endpoint]
POSTGRES_DB: crypto_place_prd
POSTGRES_USER: postgres
POSTGRES_PASSWORD: [你的資料庫密碼]
POSTGRES_PORT: 5432
```

#### 其他 Secrets:
```
COINGECKO_API_KEY: [你的 CoinGecko API Key]
```

### 更新 GitHub Actions Workflow

我接下來會幫你更新 `.github/workflows/deploy.yml` 來支援 AWS 部署。

---

## 📊 成本估算

### EC2 方案 (東京區域)

| 資源 | 規格 | 月費用 |
|------|------|--------|
| EC2 t3.micro | 1 vCPU, 1GB RAM | $0 (免費方案) |
| EC2 t3.small | 2 vCPU, 2GB RAM | ~$15 |
| EC2 t3.medium | 2 vCPU, 4GB RAM | ~$30 |
| EBS 30GB | gp3 SSD | ~$3 |
| 數據傳輸 | 100GB/月 | ~$9 |
| **總計** | | **$12-42/月** |

### ECS Fargate 方案

| 資源 | 規格 | 月費用 |
|------|------|--------|
| Fargate (Frontend) | 0.5 vCPU, 1GB | ~$15 |
| Fargate (Backend) | 1 vCPU, 2GB | ~$30 |
| RDS db.t3.micro | PostgreSQL | $0 (免費方案) |
| RDS db.t3.small | PostgreSQL | ~$25 |
| ALB | 應用負載平衡器 | ~$20 |
| 數據傳輸 | 100GB/月 | ~$9 |
| CloudFront | CDN (選配) | ~$5 |
| **總計** | | **$54-104/月** |

### 💡 省錢建議:

1. **使用免費方案** (12個月):
   - t2.micro/t3.micro EC2: 750 小時/月
   - RDS db.t3.micro: 750 小時/月
   - 15GB 數據傳輸

2. **Reserved Instances**: 長期使用可節省 30-70%

3. **使用 Spot Instances**: 開發環境可節省 70-90%

4. **CloudFront**: 使用 CDN 可減少源站流量成本

---

## 🔧 常用管理命令

### EC2 管理
```bash
# SSH 連線
ssh -i ~/.ssh/crypto-place-key.pem ubuntu@EC2_IP

# 查看服務狀態
docker-compose -f docker-compose.prod.yml ps

# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f

# 重啟服務
docker-compose -f docker-compose.prod.yml restart

# 更新代碼
cd ~/Crypto-Place
git pull origin main
./scripts/deploy.sh production
```

### ECS 管理
```bash
# 列出 clusters
aws ecs list-clusters

# 列出 services
aws ecs list-services --cluster crypto-place-cluster

# 查看 service 詳情
aws ecs describe-services \
  --cluster crypto-place-cluster \
  --services crypto-place-frontend-service

# 強制重新部署
aws ecs update-service \
  --cluster crypto-place-cluster \
  --service crypto-place-frontend-service \
  --force-new-deployment

# 查看任務日誌 (需要配置 CloudWatch)
aws logs tail /ecs/crypto-place-frontend --follow
```

---

## 📞 下一步

1. ✅ 選擇部署方案 (EC2 或 ECS)
2. ✅ 創建 AWS 資源
3. ✅ 配置 GitHub Secrets
4. ✅ 測試手動部署
5. ✅ 啟用 CI/CD 自動部署

需要我幫你配置哪個部分?
