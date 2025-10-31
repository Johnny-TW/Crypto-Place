# 🐳 Docker 使用指南

本專案使用 Docker 和 Docker Compose 進行容器化部署，支援多環境配置。

## 📋 前置需求

- Docker Engine 20.10+
- Docker Compose V2+
- 至少 4GB 可用記憶體

## 🌍 環境說明

本專案支援三種環境：

| 環境 | 配置文件 | 說明 |
|------|---------|------|
| **Development** | `docker-compose.yml` | 開發環境，支援熱重載 |
| **QAS** | `docker-compose.qas.yml` | 測試環境 |
| **Production** | `docker-compose.prod.yml` | 生產環境，優化性能和安全性 |

## 🚀 快速開始

### 1. 配置環境變數

根據您的環境，複製對應的環境變數範例文件：

```bash
# 開發環境
cp .env.example .env.dev

# 測試環境
cp .env.example .env.qas

# 生產環境
cp .env.example .env.prd
```

然後編輯對應的 `.env.*` 文件，填入實際的配置值。

### 2. 啟動服務

**開發環境：**
```bash
docker-compose up -d
```

**測試環境：**
```bash
docker-compose -f docker-compose.qas.yml up -d
```

**生產環境：**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. 檢查服務狀態

```bash
docker-compose ps
```

### 4. 查看日誌

```bash
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 📊 服務端點

### Development / QAS 環境

- **前端**: http://localhost:3001
- **後端 API**: http://localhost:5001/api
- **API 文檔**: http://localhost:5001/api/docs
- **健康檢查**: http://localhost:5001/api/health
- **PostgreSQL**: localhost:5433

### Production 環境

- **前端**: http://localhost:3001
- **後端 API**: http://localhost:5001/api
- **API 文檔**: http://localhost:5001/api/docs
- **健康檢查**: http://localhost:5001/api/health
- **PostgreSQL**: localhost:5432

## 🛠️ 常用命令

### 停止服務

```bash
docker-compose down
```

### 停止並刪除 volumes（會清除資料庫數據）

```bash
docker-compose down -v
```

### 重新構建映像

```bash
docker-compose build --no-cache
```

### 重啟特定服務

```bash
docker-compose restart backend
```

### 進入容器

```bash
# 進入後端容器
docker-compose exec backend sh

# 進入前端容器
docker-compose exec frontend sh

# 進入資料庫容器
docker-compose exec postgres psql -U postgres -d crypto_place
```

### 查看資源使用情況

```bash
docker stats
```

## 🔧 數據庫管理

### 執行 Prisma 遷移

```bash
# 開發環境
docker-compose exec backend pnpm prisma migrate dev

# 生產環境
docker-compose exec backend pnpm prisma migrate deploy
```

### 生成 Prisma Client

```bash
docker-compose exec backend pnpm prisma generate
```

### 重置資料庫（開發環境）

```bash
docker-compose exec backend pnpm prisma migrate reset
```

## 🐛 故障排除

### 1. 容器無法啟動

**檢查日誌：**
```bash
docker-compose logs backend
```

**常見問題：**
- 端口被佔用：修改 `.env.*` 中的端口配置
- 環境變數缺失：檢查 `.env.*` 文件是否配置完整
- 磁碟空間不足：清理 Docker 資源

### 2. 前端無法連接後端

**檢查配置：**
- Docker 內部使用服務名稱：`http://backend:5001`
- 外部訪問使用 localhost：`http://localhost:5001`

### 3. 資料庫連接失敗

**等待資料庫就緒：**
```bash
# 檢查 PostgreSQL 健康狀態
docker-compose exec postgres pg_isready -U postgres
```

### 4. 清理 Docker 資源

```bash
# 清理未使用的映像
docker image prune -a

# 清理未使用的 volumes
docker volume prune

# 清理所有未使用的資源
docker system prune -a --volumes
```

## 📦 Volume 說明

本專案使用以下 Docker volumes 來持久化數據：

- `postgres_data` / `postgres_qas_data` / `postgres_prd_data`: 資料庫數據
- `frontend_node_modules`: 前端依賴（僅開發環境）
- `backend_node_modules`: 後端依賴（僅開發環境）

## 🔐 生產環境安全建議

1. **修改預設密碼**: 編輯 `.env.prd` 中的 `POSTGRES_PASSWORD`
2. **使用 secrets**: 考慮使用 Docker Secrets 管理敏感資料
3. **限制網路訪問**: 配置防火牆規則
4. **定期更新映像**: 保持基礎映像最新
5. **備份數據**: 定期備份 PostgreSQL volume

## 📝 開發建議

- **本地開發**: 使用 `pnpm dev` 而非 Docker，獲得更好的開發體驗
- **測試 Docker**: 定期測試 Docker 配置，確保部署順利
- **資源監控**: 使用 `docker stats` 監控資源使用情況

## 🔗 相關文檔

- [Docker 官方文檔](https://docs.docker.com/)
- [Docker Compose 文檔](https://docs.docker.com/compose/)
- [Prisma 文檔](https://www.prisma.io/docs/)
- [NestJS Docker 部署](https://docs.nestjs.com/recipes/docker)
