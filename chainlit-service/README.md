# 🤖 Chainlit AI 聊天機器人整合指南

## 📋 概述

本專案整合了 Chainlit AI 聊天機器人與 NestJS 後端，提供智能加密貨幣助手功能。

## 🏗️ 架構圖

```
┌──────────────┐     REST API      ┌──────────────┐
│   React      │ ←────────────────→ │   NestJS     │
│   Frontend   │                    │   Backend    │
│   :5173      │                    │   :5001      │
└──────────────┘                    └──────────────┘
       ↓                                    ↕
       ↓                                    ↕
       ↓                            ┌──────────────┐
       └─────────────────────────→  │  Chainlit    │
                                    │  AI Service  │
                                    │  :8000       │
                                    └──────────────┘
                                           ↓
                                    ┌──────────────┐
                                    │  OpenAI API  │
                                    └──────────────┘
```

## 🚀 快速開始

### 1. 環境準備

```bash
# 安裝 Python 依賴
cd chainlit-service
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 環境變數設定

複製並配置環境變數：

```bash
# 根目錄 .env.dev
cp chainlit-service/.env.example chainlit-service/.env
```

編輯 `chainlit-service/.env`:

```env
NESTJS_API_URL=http://localhost:5001
OPENAI_API_KEY=sk-your-openai-api-key
LANGFUSE_PUBLIC_KEY=pk-your-public-key  # (可選)
LANGFUSE_SECRET_KEY=sk-your-secret-key  # (可選)
```

同時更新專案根目錄的 `.env.dev`:

```env
# 新增以下配置
CHAINLIT_SERVICE_URL=http://localhost:8000
CHAINLIT_PORT=8000
OPENAI_API_KEY=sk-your-openai-api-key
```

### 3. 啟動服務

#### 選項 A: 使用 Docker Compose (推薦)

```bash
# 啟動所有服務（包含 Chainlit）
docker-compose up -d

# 查看日誌
docker-compose logs -f chainlit
```

#### 選項 B: 本地開發

終端 1 - 啟動 Backend:
```bash
cd backend
pnpm dev
```

終端 2 - 啟動 Frontend:
```bash
cd frontend
pnpm dev
```

終端 3 - 啟動 Chainlit:
```bash
cd chainlit-service
source venv/bin/activate
chainlit run app.py --host 0.0.0.0 --port 8000
```

### 4. 訪問服務

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Chainlit UI**: http://localhost:8000
- **API Docs**: http://localhost:5001/api/docs

## 📡 API 端點

### NestJS Backend

#### 1. 發送訊息到 AI
```http
POST /api/ai/chat
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "message": "比特幣現在多少錢？",
  "context": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "📊 比特幣 (BTC) 市場資訊\n💰 當前價格: $45,123.45...",
    "timestamp": "2025-11-05T10:30:00.000Z"
  }
}
```

#### 2. 健康檢查
```http
GET /api/ai/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-05T10:30:00.000Z"
  }
}
```

## 🎯 功能說明

### 1. 加密貨幣查詢
用戶可以詢問特定加密貨幣的資訊：

**範例問題**:
- "比特幣現在多少錢？"
- "以太坊的市值是多少？"
- "BTC 今天漲了多少？"

**AI 回應**:
```
📈 比特幣 (BTC) 市場資訊

💰 當前價格: $45,123.45
📊 24小時漲跌: +2.34%
💎 市值: $880,234,567,890
...
```

### 2. Watchlist 管理
查看用戶的收藏清單：

**範例問題**:
- "我的收藏清單"
- "show my watchlist"
- "查看我的收藏"

### 3. 搜尋功能
搜尋加密貨幣：

**範例問題**:
- "search cardano"
- "搜尋 solana"

### 4. AI 智能問答
使用 GPT-4 回答一般問題：

**範例問題**:
- "什麼是 DeFi？"
- "如何投資加密貨幣？"
- "區塊鏈的原理是什麼？"

## 🔧 開發指南

### 在 NestJS 中使用 AI 服務

```typescript
// 在任何 NestJS service 中注入
import { AiService } from './controllers/ai/ai.service';

@Injectable()
export class SomeService {
  constructor(private readonly aiService: AiService) {}

  async askAI(question: string) {
    const response = await this.aiService.sendMessage({
      message: question,
      userId: 'user-123',
      context: { /* 額外資料 */ }
    });

    return response;
  }
}
```

### 在 Chainlit 中調用 NestJS API

```python
# app.py
async def get_coin_data(coin_id: str):
    """從 NestJS 獲取數據"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{NESTJS_API}/api/coins/{coin_id}"
        )
        return response.json()

@cl.on_message
async def main(message: cl.Message):
    coin_data = await get_coin_data("bitcoin")
    await cl.Message(content=f"Price: ${coin_data['current_price']}").send()
```

## 🎨 前端整合

### React 組件範例

```tsx
// frontend/src/components/ai/AIChat.tsx
import { useState } from 'react';
import axios from 'axios';

function AIChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/ai/chat',
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setResponse(res.data.data.response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>{response}</div>
    </div>
  );
}
```

### 嵌入 Chainlit UI

```tsx
// 直接嵌入 Chainlit UI (iframe)
function ChainlitWidget() {
  return (
    <iframe
      src="http://localhost:8000"
      className="w-full h-screen border-0"
    />
  );
}
```

## 📊 監控與日誌

### 查看 Chainlit 日誌
```bash
# Docker
docker-compose logs -f chainlit

# 本地
# 在 chainlit 終端查看輸出
```

### 查看 NestJS 日誌
```bash
# Docker
docker-compose logs -f backend

# 本地
# 在 backend 終端查看輸出
```

## 🔒 安全考量

1. **API Key 保護**
   - 永遠不要在前端暴露 OpenAI API Key
   - 使用環境變數儲存敏感資訊
   - 加入到 `.gitignore`

2. **認證與授權**
   - AI 端點需要 JWT 驗證
   - 限制 Rate Limiting
   - 監控 API 使用量

3. **輸入驗證**
   - 驗證用戶輸入
   - 防止注入攻擊
   - 限制訊息長度

## 💰 成本估算

### OpenAI API 使用成本

使用 GPT-4:
- 輸入: $0.03 / 1K tokens
- 輸出: $0.06 / 1K tokens

**範例場景**:
- 1000 個活躍用戶
- 每用戶每天 10 次對話
- 每次對話平均 500 tokens

**每月成本**: ~$650 USD

### 優化建議
1. 使用 GPT-3.5-turbo (更便宜)
2. 實作快取機制
3. 限制每日請求次數
4. 使用 Langfuse 追蹤成本

## 🐛 常見問題

### 1. Chainlit 無法連接到 NestJS

**檢查**:
- NestJS 是否正在運行？ (`http://localhost:5001/api/health`)
- `NESTJS_API_URL` 環境變數是否正確？
- Docker network 連接是否正常？

**解決**:
```bash
# 檢查服務狀態
docker-compose ps

# 重啟服務
docker-compose restart backend chainlit
```

### 2. OpenAI API 錯誤

**檢查**:
- API Key 是否正確？
- 是否有足夠的額度？
- 網路連接是否正常？

### 3. 記憶體不足

**解決**:
調整 docker-compose.yml:
```yaml
chainlit:
  mem_limit: 2g  # 從 1g 增加到 2g
```

## 📚 參考資源

- [Chainlit 官方文檔](https://docs.chainlit.io/)
- [OpenAI API 文檔](https://platform.openai.com/docs)
- [NestJS 文檔](https://docs.nestjs.com/)
- [Langfuse 文檔](https://langfuse.com/docs)

## 🔄 未來計劃

- [ ] 添加對話歷史記錄
- [ ] 整合更多 AI 工具 (LangChain Tools)
- [ ] 支援檔案上傳分析
- [ ] 多語言支援
- [ ] 語音對話功能
- [ ] 整合 Telegram/Discord Bot

## 📝 更新日誌

### 2025-11-05
- ✅ 初始化 Chainlit 服務
- ✅ 建立 NestJS AI 模組
- ✅ Docker Compose 整合
- ✅ 基礎功能實作

---

**維護者**: Crypto-Place Team
**最後更新**: 2025-11-05
