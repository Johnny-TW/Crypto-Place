# CI/CD 檢查清單

## 📋 當前流程概覽

```
┌─────────────┐
│   Setup     │ → 安裝依賴、設定快取
└──────┬──────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
┌──────▼──────┐ ┌───▼────┐  ┌────▼─────┐
│    Test     │ │Security│  │  Build   │
│ (parallel)  │ │(CodeQL)│  │(artifacts)│
└──────┬──────┘ └───┬────┘  └────┬─────┘
       │             │            │
       └─────────────┴────────────┘
                     │
              ┌──────▼───────┐
              │ Docker Build │ (僅 main 分支)
              └──────┬───────┘
                     │
              ┌──────▼───────┐
              │   Deploy     │ (僅 main 分支)
              └──────────────┘
```

## ✅ 已配置的功能

### 1. 基礎設施
- [x] Node.js 18 + pnpm 9
- [x] 依賴快取 (actions/cache@v4.2.0)
- [x] Matrix 策略並行處理 frontend/backend

### 2. 測試階段
- [x] ESLint 檢查
- [x] TypeScript 型別檢查
- [x] Jest 單元測試 + Coverage
- [ ] E2E 測試 (前端暫時停用)

### 3. 安全掃描
- [x] pnpm audit (依賴漏洞)
- [x] CodeQL 靜態分析
- [x] Trivy 容器掃描
- [x] Coverage 上傳到 Codecov

### 4. 建置 & 部署
- [x] 建置產物上傳 (artifacts)
- [x] Docker 映像建置與推送
- [x] Docker Hub 整合
- [x] 生產環境部署腳本
- [ ] 健康檢查 (需要設定 URL)

## ⚠️ 需要設定的 GitHub Secrets

在 GitHub Repository → Settings → Secrets and variables → Actions 中設定:

### Secrets (敏感資料)
```bash
DOCKER_USERNAME       # Docker Hub 用戶名
DOCKER_TOKEN          # Docker Hub Access Token
POSTGRES_PASSWORD     # 生產環境資料庫密碼
COINGECKO_API_KEY    # CoinGecko API 金鑰
SLACK_WEBHOOK_URL    # Slack 通知 (可選)
```

### Variables (非敏感配置)
```bash
VITE_API_BASE_URL    # 前端 API 基礎 URL
FRONTEND_URL         # 前端網址 (用於健康檢查)
BACKEND_URL          # 後端網址 (用於健康檢查)
```

## 🔧 目前的已知限制

### 1. E2E 測試未配置
```yaml
# 目前狀態: 已在 workflow 中停用
- name: Run E2E tests (frontend only)
  if: matrix.service == 'frontend' && false  # ← 暫時停用
```

**解決方案**:
- 選項 1: 使用 Playwright 或 Cypress 配置 E2E 測試
- 選項 2: 刪除此步驟直到需要時再加入

### 2. 部署流程為模擬
目前 deploy job 只是在 CI 環境中測試 Docker Compose,並未真正部署到生產環境。

**實際部署需要**:
- SSH 到目標服務器
- 或使用 Kubernetes/AWS/GCP 等雲平台部署
- 或使用 GitHub Actions Self-hosted Runner

### 3. 健康檢查需要 URL
```yaml
if: ${{ vars.FRONTEND_URL && vars.BACKEND_URL }}
```
需要在 GitHub Variables 中設定這些 URL。

## 📊 效能優化建議

### 1. 快取優化 ✅
已使用 actions/cache@v4.2.0 快取:
- `frontend/node_modules`
- `backend/node_modules`
- Docker layer cache (gha)

### 2. 並行化 ✅
- Test 和 Security 並行執行
- Frontend 和 Backend 使用 matrix 並行處理

### 3. 條件執行 ✅
- Docker Build: 僅在 `main` 分支執行
- Deploy: 僅在 `main` 分支執行
- E2E: 僅 frontend 執行 (目前停用)

## 🚀 觸發條件

### Push 到分支
- `main` → 完整流程 (包含 Docker + Deploy)
- `develop` → 測試 + 建置 (不包含 Docker + Deploy)

### Pull Request
- 目標分支 `main` → 執行測試 + 安全掃描

## 📝 最佳實踐檢查

- [x] 使用 pnpm 而非 npm (更快、更省空間)
- [x] 使用 frozen-lockfile 確保依賴一致性
- [x] 分離測試和安全掃描 (並行執行)
- [x] 使用 matrix 策略減少重複代碼
- [x] 快取依賴和 Docker layers
- [x] 限制建置產物保留天數 (retention-days: 1)
- [x] 使用 fail-fast: false 確保所有測試都執行
- [x] 環境變數使用 Secrets 管理
- [x] Docker 映像安全掃描 (Trivy)
- [ ] 設定 branch protection rules
- [ ] 設定 required status checks

## 🔍 故障排查

### 如果 CI 失敗...

1. **Lint 失敗**
   ```bash
   cd frontend && pnpm lint --fix
   cd backend && pnpm lint --fix
   ```

2. **測試失敗**
   ```bash
   cd frontend && pnpm test
   cd backend && pnpm test:ci
   ```

3. **Type check 失敗**
   ```bash
   cd frontend && pnpm type-check
   cd backend && pnpm type-check
   ```

4. **Docker build 失敗**
   - 檢查 DOCKER_USERNAME 和 DOCKER_TOKEN 是否設定
   - 確認 Docker Hub 帳號有權限

5. **依賴安裝失敗**
   - 刪除本地 node_modules 重新安裝
   - 確認 pnpm-lock.yaml 已提交

## 📚 相關文件

- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [pnpm 文件](https://pnpm.io/)
- [Docker 文件](https://docs.docker.com/)
- [Trivy 文件](https://aquasecurity.github.io/trivy/)
- [CodeQL 文件](https://codeql.github.com/docs/)

