import chainlit as cl
import httpx
import os
from typing import Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime
import time

# 條件導入 Langfuse
try:
    from langfuse.decorators import observe, langfuse_context
    LANGFUSE_AVAILABLE = True
except ImportError:
    LANGFUSE_AVAILABLE = False
    print("ℹ️ Langfuse 未安裝，監控功能將被停用")

# 載入環境變數
load_dotenv()

# 配置
NESTJS_API = os.getenv("NESTJS_API_URL", "http://localhost:5001")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY", "CG-nrJXAB28gG2xbfsdLieGcxWB")
COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

# Langfuse 配置
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")   

# 初始化 Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# 檢查 Langfuse 是否可用
langfuse_enabled = False
if LANGFUSE_AVAILABLE and LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY:
    # 設定 Langfuse 環境變數 (decorators 會自動使用)
    os.environ["LANGFUSE_PUBLIC_KEY"] = LANGFUSE_PUBLIC_KEY
    os.environ["LANGFUSE_SECRET_KEY"] = LANGFUSE_SECRET_KEY
    os.environ["LANGFUSE_HOST"] = LANGFUSE_HOST
    langfuse_enabled = True
    print(f"✅ Langfuse 監控已啟用")
else:
    if not LANGFUSE_AVAILABLE:
        print(f"ℹ️ Langfuse 監控未啟用 (套件未安裝)")
    else:
        print(f"ℹ️ Langfuse 監控未啟用 (未設定金鑰)")

print(f"🤖 使用模型: {GEMINI_MODEL}")

# NestJS API 調用函數
async def call_nestjs_api(
    endpoint: str,
    method: str = "GET",
    data: Optional[Dict] = None,
    token: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """通用 NestJS API 調用函數"""
    url = f"{NESTJS_API}{endpoint}"
    headers = {}
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=headers, timeout=10.0)
            elif method == "POST":
                response = await client.post(url, json=data, headers=headers, timeout=10.0)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"API Error: {e}")
            return None

async def get_coin_data(coin_id: str) -> Optional[Dict[str, Any]]:
    """獲取加密貨幣數據"""
    return await call_nestjs_api(f"/api/coins/{coin_id}")

async def get_user_watchlist(token: str) -> Optional[list]:
    """獲取用戶 watchlist"""
    result = await call_nestjs_api("/api/watchlist", token=token)
    return result if result else []

async def search_coins(query: str) -> Optional[list]:
    """搜尋加密貨幣"""
    return await call_nestjs_api(f"/api/search?q={query}")

# CoinGecko API 直接調用函數

async def fetch_coingecko_data(endpoint: str, params: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
    """直接調用 CoinGecko API"""
    url = f"{COINGECKO_API_BASE}{endpoint}"
    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": COINGECKO_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params, timeout=15.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"CoinGecko API Error: {e}")
            return None

async def get_crypto_price(coin_id: str) -> Optional[Dict[str, Any]]:
    """獲取單一加密貨幣的即時價格和市場資訊"""
    data = await fetch_coingecko_data(
        f"/coins/{coin_id}",
        params={
            "localization": "false",
            "tickers": "false",
            "market_data": "true",
            "community_data": "false",
            "developer_data": "false"
        }
    )
    
    if not data:
        return None
    
    # 提取關鍵市場資料
    market_data = data.get("market_data", {})
    return {
        "id": data.get("id"),
        "symbol": data.get("symbol", "").upper(),
        "name": data.get("name"),
        "image": data.get("image", {}).get("large"),
        "current_price_usd": market_data.get("current_price", {}).get("usd"),
        "current_price_twd": market_data.get("current_price", {}).get("twd"),
        "market_cap_usd": market_data.get("market_cap", {}).get("usd"),
        "market_cap_rank": market_data.get("market_cap_rank"),
        "total_volume_usd": market_data.get("total_volume", {}).get("usd"),
        "high_24h_usd": market_data.get("high_24h", {}).get("usd"),
        "low_24h_usd": market_data.get("low_24h", {}).get("usd"),
        "price_change_24h": market_data.get("price_change_24h"),
        "price_change_percentage_24h": market_data.get("price_change_percentage_24h"),
        "price_change_percentage_7d": market_data.get("price_change_percentage_7d"),
        "price_change_percentage_30d": market_data.get("price_change_percentage_30d"),
        "circulating_supply": market_data.get("circulating_supply"),
        "total_supply": market_data.get("total_supply"),
        "max_supply": market_data.get("max_supply"),
        "ath": market_data.get("ath", {}).get("usd"),
        "ath_date": market_data.get("ath_date", {}).get("usd"),
        "atl": market_data.get("atl", {}).get("usd"),
        "atl_date": market_data.get("atl_date", {}).get("usd"),
        "last_updated": data.get("last_updated")
    }

async def get_trending_coins() -> Optional[list]:
    """獲取當前熱門加密貨幣"""
    data = await fetch_coingecko_data("/search/trending")
    
    if not data or "coins" not in data:
        return None
    
    trending = []
    for item in data.get("coins", [])[:10]:
        coin = item.get("item", {})
        trending.append({
            "id": coin.get("id"),
            "name": coin.get("name"),
            "symbol": coin.get("symbol"),
            "market_cap_rank": coin.get("market_cap_rank"),
            "price_btc": coin.get("price_btc"),
            "thumb": coin.get("thumb")
        })
    
    return trending

async def get_nft_data(nft_id: str) -> Optional[Dict[str, Any]]:
    """獲取 NFT 系列資訊"""
    data = await fetch_coingecko_data(f"/nfts/{nft_id}")
    
    if not data:
        return None
    
    return {
        "id": data.get("id"),
        "name": data.get("name"),
        "symbol": data.get("asset_platform_id"),
        "description": data.get("description"),
        "image": data.get("image", {}).get("small"),
        "floor_price_usd": data.get("floor_price", {}).get("usd"),
        "floor_price_native": data.get("floor_price", {}).get("native_currency"),
        "market_cap_usd": data.get("market_cap", {}).get("usd"),
        "volume_24h_usd": data.get("volume_24h", {}).get("usd"),
        "total_supply": data.get("total_supply"),
        "number_of_unique_addresses": data.get("number_of_unique_addresses"),
        "links": data.get("links", {})
    }

async def search_coingecko(query: str) -> Optional[list]:
    """在 CoinGecko 搜尋加密貨幣和 NFT"""
    data = await fetch_coingecko_data("/search", params={"query": query})
    
    if not data:
        return None
    
    results = []
    
    # 加密貨幣結果
    for coin in data.get("coins", [])[:5]:
        results.append({
            "type": "coin",
            "id": coin.get("id"),
            "name": coin.get("name"),
            "symbol": coin.get("symbol"),
            "market_cap_rank": coin.get("market_cap_rank"),
            "thumb": coin.get("thumb")
        })
    
    # NFT 結果
    for nft in data.get("nfts", [])[:3]:
        results.append({
            "type": "nft",
            "id": nft.get("id"),
            "name": nft.get("name"),
            "symbol": nft.get("symbol"),
            "thumb": nft.get("thumb")
        })
    
    return results

# AI 助手邏輯

@cl.on_chat_start
async def start():
    """聊天開始時的歡迎訊息"""
    welcome_message = """
👋 **歡迎來到 Crypto-Place AI 助手！**

我可以幫你：
- 🔍 查詢加密貨幣即時資訊
- 📊 分析市場趨勢
- 💼 查看你的收藏清單
- 📈 提供投資建議
- 📰 獲取最新加密貨幣新聞

請問有什麼可以幫助你的嗎？
"""
    await cl.Message(content=welcome_message).send()
    
    # 儲存用戶 session
    cl.user_session.set("conversation_history", [])

@cl.on_message
async def main(message: cl.Message):
    """處理用戶訊息"""
    user_query = message.content
    user_query_lower = user_query.lower()
    user_token = cl.user_session.get("jwt_token")  # 從 session 獲取 JWT
    user_id = cl.user_session.get("user_id", "anonymous")  # 獲取用戶 ID
    
    # 顯示正在處理的訊息
    processing_msg = cl.Message(content="🔍 正在查詢資料...")
    await processing_msg.send()
    
    try:
        crypto_data = None
        response = None
        
        # 檢測是否詢問價格、市場資訊等
        is_price_query = any(keyword in user_query_lower for keyword in [
            "價格", "price", "多少", "市值", "市場", "漲", "跌", "波動"
        ])
        
        # 檢測是否詢問熱門趨勢
        is_trending_query = any(keyword in user_query_lower for keyword in [
            "熱門", "trending", "趨勢", "流行"
        ])
        
        # 檢測是否詢問 NFT
        is_nft_query = any(keyword in user_query_lower for keyword in [
            "nft", "非同質化代幣", "藝術品"
        ])
        
        # 常見加密貨幣 ID 映射
        crypto_map = {
            "bitcoin": ["bitcoin", "btc", "比特幣"],
            "ethereum": ["ethereum", "eth", "以太坊", "以太幣"],
            "binancecoin": ["bnb", "binance", "幣安幣"],
            "solana": ["solana", "sol"],
            "cardano": ["cardano", "ada"],
            "ripple": ["ripple", "xrp", "瑞波幣"],
            "dogecoin": ["dogecoin", "doge", "狗狗幣"],
            "polkadot": ["polkadot", "dot"],
            "avalanche-2": ["avalanche", "avax"],
            "chainlink": ["chainlink", "link"]
        }
        
        # 識別用戶想查詢的加密貨幣
        detected_coin = None
        for coin_id, keywords in crypto_map.items():
            if any(keyword in user_query_lower for keyword in keywords):
                detected_coin = coin_id
                break
        
        # 處理熱門趨勢查詢
        if is_trending_query:
            processing_msg.content = "📊 正在獲取熱門加密貨幣..."
            await processing_msg.update()
            
            trending = await get_trending_coins()
            if trending:
                response = await generate_ai_response_with_data(
                    user_query,
                    {"trending_coins": trending},
                    user_id
                )
        
        # 處理特定加密貨幣查詢
        elif detected_coin and is_price_query:
            processing_msg.content = f"💰 正在獲取 {detected_coin} 即時資料..."
            await processing_msg.update()
            
            crypto_data = await get_crypto_price(detected_coin)
            if crypto_data:
                response = await generate_ai_response_with_data(
                    user_query,
                    {"crypto_data": crypto_data},
                    user_id
                )
        
        # 處理收藏清單查詢
        elif any(keyword in user_query_lower for keyword in ["watchlist", "收藏", "清單", "追蹤"]):
            response = await handle_watchlist_query(user_token)
        
        # 處理搜尋查詢
        elif any(keyword in user_query_lower for keyword in ["search", "搜尋", "找", "查"]) and not is_price_query:
            # 提取搜尋關鍵字
            search_term = user_query_lower
            for word in ["search", "搜尋", "找", "查"]:
                search_term = search_term.replace(word, "").strip()
            
            processing_msg.content = f"🔍 正在搜尋 {search_term}..."
            await processing_msg.update()
            
            results = await search_coingecko(search_term)
            if results:
                response = await generate_ai_response_with_data(
                    user_query,
                    {"search_results": results, "query": search_term},
                    user_id
                )
        
        # 如果沒有特定處理,使用 AI 通用回答
        if not response:
            processing_msg.content = "🤔 正在思考..."
            await processing_msg.update()
            response = await generate_ai_response(user_query, user_id=user_id)
        
        # 更新訊息內容
        processing_msg.content = response
        await processing_msg.update()
        
    except Exception as e:
        error_message = f"❌ 抱歉，發生錯誤: {str(e)}"
        processing_msg.content = error_message
        await processing_msg.update()

# 查詢處理函數

async def handle_coin_query(coin_id: str) -> str:
    """處理加密貨幣查詢"""
    coin_data = await get_coin_data(coin_id)
    
    if not coin_data:
        return f"❌ 無法獲取 {coin_id} 的數據，請稍後再試。"
    
    # 格式化回應
    price_change = coin_data.get('price_change_percentage_24h', 0)
    emoji = "📈" if price_change > 0 else "📉"
    
    response = f"""
{emoji} **{coin_data.get('name', coin_id)} ({coin_data.get('symbol', '').upper()})** 市場資訊

💰 **當前價格**: ${coin_data.get('current_price', 0):,.2f}
📊 **24小時漲跌**: {price_change:+.2f}%
💎 **市值**: ${coin_data.get('market_cap', 0):,.0f}
📊 **24小時交易量**: ${coin_data.get('total_volume', 0):,.0f}
📈 **24小時最高**: ${coin_data.get('high_24h', 0):,.2f}
📉 **24小時最低**: ${coin_data.get('low_24h', 0):,.2f}

---
💡 需要更多資訊或分析嗎？
"""
    return response

async def handle_watchlist_query(token: Optional[str]) -> str:
    """處理 watchlist 查詢"""
    if not token:
        return "⚠️ 請先登入才能查看收藏清單。"
    
    watchlist = await get_user_watchlist(token)
    
    if not watchlist or len(watchlist) == 0:
        return "📋 你的收藏清單目前是空的。\n\n試試搜尋你感興趣的加密貨幣並加入收藏吧！"
    
    response = "📋 **你的收藏清單**\n\n"
    for idx, item in enumerate(watchlist[:10], 1):  # 最多顯示10個
        response += f"{idx}. {item['coinName']} ({item['symbol'].upper()})\n"
    
    if len(watchlist) > 10:
        response += f"\n... 還有 {len(watchlist) - 10} 個收藏"
    
    return response

async def handle_search_query(query: str) -> str:
    """處理搜尋查詢"""
    results = await search_coins(query)
    
    if not results or len(results) == 0:
        return f"🔍 找不到與 '{query}' 相關的加密貨幣。"
    
    response = f"🔍 **搜尋結果: '{query}'**\n\n"
    for idx, coin in enumerate(results[:5], 1):  # 最多顯示5個結果
        response += f"{idx}. {coin['name']} ({coin['symbol'].upper()})\n"
    
    return response

# 根據 Langfuse 是否可用來決定是否使用 decorator
if langfuse_enabled and LANGFUSE_AVAILABLE:
    @observe(name="generate_ai_response")
    async def generate_ai_response(query: str, user_id: str = None) -> str:
        """使用 Google Gemini 生成 AI 回答 (帶 Langfuse 監控)"""
        return await _generate_ai_response_impl(query, user_id)
    
    @observe(name="generate_ai_response_with_data")
    async def generate_ai_response_with_data(query: str, data: Dict[str, Any], user_id: str = None) -> str:
        """使用 Google Gemini 生成 AI 回答,並帶入即時資料 (帶 Langfuse 監控)"""
        return await _generate_ai_response_with_data_impl(query, data, user_id)
else:
    async def generate_ai_response(query: str, user_id: str = None) -> str:
        """使用 Google Gemini 生成 AI 回答"""
        return await _generate_ai_response_impl(query, user_id)
    
    async def generate_ai_response_with_data(query: str, data: Dict[str, Any], user_id: str = None) -> str:
        """使用 Google Gemini 生成 AI 回答,並帶入即時資料"""
        return await _generate_ai_response_with_data_impl(query, data, user_id)

async def _generate_ai_response_with_data_impl(query: str, data: Dict[str, Any], user_id: str = None) -> str:
    """AI 回答生成的實際實作 (帶即時資料)"""
    start_time = time.time()
    
    try:
        import json
        
        # 建立系統提示詞
        system_prompt = """你是一位專業的加密貨幣投資顧問，名叫 Crypto Assistant。
你的特點：
- 用繁體中文回答
- 專業但友善
- 提供準確的市場分析
- 給予實用的投資建議
- 必要時會提醒風險
- 使用提供的即時市場資料來回答問題

重要提醒：
- 價格顯示請使用美元 (USD) 並加上千分位符號
- 漲跌幅度請顯示為百分比，並標註正負號
- 提供數據來源為 CoinGecko
- 適時提醒投資風險
"""
        
        # 格式化資料為易讀文字
        data_text = "\n\n--- 即時市場資料 (來自 CoinGecko) ---\n"
        data_text += json.dumps(data, ensure_ascii=False, indent=2)
        
        # 組合完整的提示詞
        full_prompt = f"{system_prompt}\n\n用戶問題: {query}{data_text}\n\n請根據以上即時資料,用專業且友善的方式回答用戶問題。"
        
        # 如果 Langfuse 啟用，使用 context 記錄
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_trace(
                name="crypto_ai_chat_with_data",
                user_id=user_id or "anonymous",
                metadata={
                    "model": GEMINI_MODEL,
                    "has_market_data": True,
                    "timestamp": datetime.now().isoformat()
                }
            )
            
            langfuse_context.update_current_observation(
                input={"query": query, "data_keys": list(data.keys())},
                metadata={"model": GEMINI_MODEL, "data_source": "coingecko"}
            )
        
        # 調用 Gemini API (同步方式)
        response = gemini_model.generate_content(full_prompt)
        response_text = response.text
        
        # 計算執行時間
        duration = time.time() - start_time
        
        # 如果 Langfuse 啟用，記錄輸出
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_observation(
                output=response_text,
                metadata={
                    "status": "success",
                    "response_length": len(response_text),
                    "duration_seconds": round(duration, 2)
                }
            )
        
        return response_text
    
    except Exception as e:
        error_message = f"❌ AI 回答生成失敗: {str(e)}"
        
        # 如果 Langfuse 啟用，記錄錯誤
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_observation(
                metadata={
                    "status": "error",
                    "error": str(e),
                    "duration_seconds": round(time.time() - start_time, 2)
                }
            )
        
        return error_message

async def _generate_ai_response_impl(query: str, user_id: str = None) -> str:
    """AI 回答生成的實際實作"""
    start_time = time.time()
    
    try:
        # 建立系統提示詞
        system_prompt = """你是一位專業的加密貨幣投資顧問，名叫 Crypto Assistant。
你的特點：
- 用繁體中文回答
- 專業但友善
- 提供準確的市場分析
- 給予實用的投資建議
- 必要時會提醒風險
"""
        
        # 組合完整的提示詞
        full_prompt = f"{system_prompt}\n\n用戶問題: {query}"
        
        # 如果 Langfuse 啟用，使用 context 記錄
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_trace(
                name="crypto_ai_chat",
                user_id=user_id or "anonymous",
                metadata={
                    "model": GEMINI_MODEL,
                    "timestamp": datetime.now().isoformat()
                }
            )
            
            langfuse_context.update_current_observation(
                input={"query": query, "system_prompt": system_prompt},
                metadata={"model": GEMINI_MODEL}
            )
        
        # 調用 Gemini API (同步方式)
        response = gemini_model.generate_content(full_prompt)
        response_text = response.text
        
        # 計算執行時間
        duration = time.time() - start_time
        
        # 如果 Langfuse 啟用，記錄輸出
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_observation(
                output=response_text,
                metadata={
                    "status": "success",
                    "response_length": len(response_text),
                    "duration_seconds": round(duration, 2)
                }
            )
        
        return response_text
    
    except Exception as e:
        error_message = f"❌ AI 回答生成失敗: {str(e)}"
        
        # 如果 Langfuse 啟用，記錄錯誤
        if langfuse_enabled and LANGFUSE_AVAILABLE:
            langfuse_context.update_current_observation(
                metadata={
                    "status": "error",
                    "error": str(e),
                    "duration_seconds": round(time.time() - start_time, 2)
                }
            )
        
        return error_message

# 錯誤處理

@cl.on_chat_end
async def end():
    """聊天結束時的處理"""
    await cl.Message(content="👋 感謝使用 Crypto-Place AI 助手！").send()

if __name__ == "__main__":
    # 本地測試用
    print("🚀 Chainlit AI Service Started")
    print(f"📡 NestJS API: {NESTJS_API}")
