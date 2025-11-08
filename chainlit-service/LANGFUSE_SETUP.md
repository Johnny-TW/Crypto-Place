# Langfuse AI 監控設定指南

## 🎯 什麼是 Langfuse?

Langfuse 是一個開源的 LLM (大型語言模型) 觀測與分析平台,可以幫助你:

- 📊 追蹤每次 AI 對話的完整記錄
- 💰 監控 API 使用成本
- ⚡ 分析回應時間和效能
- 🐛 除錯 AI 回答問題
- 📈 視覺化使用趨勢和模式
- 👥 追蹤不同用戶的使用情況

## 🚀 快速設定步驟

### 1. 註冊 Langfuse 帳號

前往 [Langfuse Cloud](https://cloud.langfuse.com) 註冊免費帳號

**免費方案包含**:
- ✅ 每月 50,000 個事件 (traces)
- ✅ 無限專案
- ✅ 完整功能存取
- ✅ 30 天資料保留

### 2. 建立專案並取得 API 金鑰

1. 登入後點擊 **"Create Project"**
2. 輸入專案名稱: `Crypto-Place AI`
3. 進入專案設定 (Settings)
4. 點擊 **"API Keys"** 標籤
5. 點擊 **"Create new API key"**
6. 複製 **Public Key** 和 **Secret Key**

### 3. 更新環境變數

編輯 `chainlit-service/.env` 檔案:

```bash
# Langfuse Configuration
LANGFUSE_PUBLIC_KEY=pk-lf-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANGFUSE_SECRET_KEY=sk-lf-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 4. 重啟 Chainlit 服務

```bash
cd chainlit-service
source venv/bin/activate
chainlit run app.py --host 0.0.0.0 --port 8000
```

啟動時應該會看到:
```
✅ Langfuse 監控已啟用
🤖 使用模型: gemini-2.0-flash
```

## 📊 監控的資訊

設定完成後,每次 AI 對話都會自動記錄以下資訊:

### Trace (對話追蹤)
- **用戶 ID**: 識別不同用戶
- **時間戳記**: 對話發生時間
- **模型**: 使用的 Gemini 模型
- **輸入**: 用戶的問題
- **輸出**: AI 的回答
- **狀態**: 成功/失敗

### Generation (生成詳情)
- **提示詞**: 完整的 system prompt + user query
- **回答長度**: 回答的字數
- **完成原因**: 正常完成或錯誤

### Metadata (元數據)
- 時間戳記 (ISO 格式)
- 回答狀態 (success/error)
- 錯誤訊息 (如果有)

## 🔍 在 Langfuse 中查看資料

### 1. Dashboard (儀表板)
登入 Langfuse 後,主頁面會顯示:
- 📈 總對話數量
- ⏱️ 平均回應時間
- 📊 使用趨勢圖表
- 🎯 熱門查詢

### 2. Traces (追蹤列表)
點擊 **"Traces"** 可以看到:
- 所有對話的列表
- 每個對話的詳細資訊
- 用戶 ID 和時間
- 輸入/輸出內容

### 3. 點擊單一 Trace 查看
- 完整的對話流程
- 每個步驟的時間
- 輸入和輸出的完整內容
- 相關的 metadata

## 🎨 進階功能

### 1. 自訂標籤 (Tags)
可以在程式碼中加入標籤來分類對話:

```python
trace = langfuse.trace(
    name="crypto_ai_chat",
    tags=["bitcoin_query", "price_check"]
)
```

### 2. 計分功能 (Scoring)
可以讓用戶對回答評分:

```python
trace.score(
    name="user_feedback",
    value=5,  # 1-5 分
    comment="回答很有幫助"
)
```

### 3. 成本追蹤
Langfuse 會自動計算 API 使用成本 (如果模型有設定價格)

## 🔧 故障排除

### 問題 1: 看不到資料
**檢查**:
- ✅ API 金鑰是否正確
- ✅ 網路連線是否正常
- ✅ 程式啟動時是否顯示 "Langfuse 監控已啟用"

### 問題 2: 錯誤訊息
如果看到 `Langfuse 初始化失敗`,請檢查:
- API 金鑰格式是否正確
- LANGFUSE_HOST 是否正確設定
- 防火牆是否阻擋連線

### 問題 3: 不想使用監控
如果暫時不需要監控,可以:
1. 保持 LANGFUSE_PUBLIC_KEY 和 SECRET_KEY 為空
2. 程式會自動跳過 Langfuse 初始化
3. 顯示: `ℹ️ Langfuse 監控未啟用 (未設定金鑰)`

## 📚 更多資源

- 官方文件: https://langfuse.com/docs
- GitHub: https://github.com/langfuse/langfuse
- Discord 社群: https://discord.gg/7NXusRtqYU
- 使用範例: https://langfuse.com/docs/integrations

## 💡 最佳實踐

1. **定期檢查 Dashboard**: 了解用戶使用模式
2. **設定告警**: 當錯誤率過高時通知
3. **分析熱門查詢**: 優化常見問題的回答
4. **追蹤成本**: 監控 API 使用量避免超支
5. **用戶隱私**: 注意不要記錄敏感資訊

---

設定完成後,你的 AI 助手就擁有完整的監控和分析功能了! 🎉
