# CI/CD 改善建議

## 1. 修復測試命令
```yaml
# 在 frontend package.json 中添加
"test:e2e": "playwright test",
"test:e2e:headless": "playwright test --headless"
```

## 2. 環境變數管理
```yaml
env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  API_KEY: ${{ secrets.API_KEY }}
```

## 3. 改善部署階段
```yaml
deploy:
  runs-on: ubuntu-latest
  needs: docker-build
  if: github.ref == 'refs/heads/main'
  environment: production
  
  steps:
  - name: Deploy to production
    run: |
      echo "🚀 Deploying to production..."
      # 實際部署命令
      docker-compose pull
      docker-compose up -d
      
  - name: Health check
    run: |
      echo "🔍 Running health checks..."
      curl -f http://localhost:3000/health || exit 1
      curl -f http://localhost:5173/health || exit 1
```

## 4. 添加 Prisma 數據庫遷移
```yaml
- name: Run database migrations
  run: |
    cd app/backend
    pnpm prisma migrate deploy
```

## 5. 添加 Docker Compose 支援
```yaml
- name: Deploy with Docker Compose
  run: |
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
```

## 6. 添加通知功能
```yaml
- name: Notify deployment
  if: always()
  run: |
    if [ "${{ job.status }}" == "success" ]; then
      echo "✅ Deployment successful!"
    else
      echo "❌ Deployment failed!"
    fi
```