#!/usr/bin/env python3
"""
CoinGecko API 整合測試腳本
測試加密貨幣和 NFT 資料獲取以及 AI 分析功能
"""

import asyncio
import sys
from app import (
    get_crypto_price, 
    get_trending_coins, 
    search_coingecko,
    generate_ai_response_with_data
)

async def test_crypto_price():
    """測試獲取單一加密貨幣價格"""
    print("=" * 60)
    print("🧪 測試 1: 獲取 Bitcoin 即時價格")
    print("=" * 60)
    
    btc_data = await get_crypto_price("bitcoin")
    if btc_data:
        print(f"✅ 名稱: {btc_data['name']} ({btc_data['symbol']})")
        print(f"✅ 當前價格 (USD): ${btc_data['current_price_usd']:,.2f}")
        print(f"✅ 當前價格 (TWD): NT${btc_data['current_price_twd']:,.0f}")
        print(f"✅ 市值排名: #{btc_data['market_cap_rank']}")
        print(f"✅ 24h 漲跌: {btc_data['price_change_percentage_24h']:+.2f}%")
        print(f"✅ 7d 漲跌: {btc_data['price_change_percentage_7d']:+.2f}%")
        print(f"✅ 24h 最高: ${btc_data['high_24h_usd']:,.2f}")
        print(f"✅ 24h 最低: ${btc_data['low_24h_usd']:,.2f}")
        print(f"✅ 市值: ${btc_data['market_cap_usd']:,.0f}")
        print(f"✅ 24h 交易量: ${btc_data['total_volume_usd']:,.0f}")
        return True
    else:
        print("❌ 無法獲取 Bitcoin 資料")
        return False

async def test_ethereum_price():
    """測試獲取 Ethereum 價格"""
    print("\n" + "=" * 60)
    print("🧪 測試 2: 獲取 Ethereum 即時價格")
    print("=" * 60)
    
    eth_data = await get_crypto_price("ethereum")
    if eth_data:
        print(f"✅ 名稱: {eth_data['name']} ({eth_data['symbol']})")
        print(f"✅ 當前價格: ${eth_data['current_price_usd']:,.2f}")
        print(f"✅ 24h 漲跌: {eth_data['price_change_percentage_24h']:+.2f}%")
        print(f"✅ 歷史最高: ${eth_data['ath']:,.2f}")
        print(f"✅ 歷史最低: ${eth_data['atl']:,.2f}")
        return True
    else:
        print("❌ 無法獲取 Ethereum 資料")
        return False

async def test_trending():
    """測試獲取熱門加密貨幣"""
    print("\n" + "=" * 60)
    print("🧪 測試 3: 獲取熱門加密貨幣 Top 10")
    print("=" * 60)
    
    trending = await get_trending_coins()
    if trending:
        for idx, coin in enumerate(trending, 1):
            print(f"{idx}. {coin['name']} ({coin['symbol']}) - 排名 #{coin['market_cap_rank']}")
        return True
    else:
        print("❌ 無法獲取熱門幣種")
        return False

async def test_search():
    """測試搜尋功能"""
    print("\n" + "=" * 60)
    print("🧪 測試 4: 搜尋 'bitcoin'")
    print("=" * 60)
    
    results = await search_coingecko("bitcoin")
    if results:
        for result in results:
            type_emoji = "🪙" if result['type'] == 'coin' else "🎨"
            print(f"{type_emoji} {result['type'].upper()}: {result['name']} ({result['symbol']})")
        return True
    else:
        print("❌ 搜尋失敗")
        return False

async def test_ai_response():
    """測試 AI 分析功能"""
    print("\n" + "=" * 60)
    print("🧪 測試 5: AI 分析 ETH 市場資料")
    print("=" * 60)
    
    eth_data = await get_crypto_price("ethereum")
    if eth_data:
        print("📊 正在請 AI 分析資料...")
        response = await generate_ai_response_with_data(
            "請分析 ETH 現在的價格走勢，並給我一些投資建議",
            {"crypto_data": eth_data},
            "test_user"
        )
        print("\n🤖 AI 回答:")
        print("-" * 60)
        print(response)
        print("-" * 60)
        return True
    else:
        print("❌ 無法獲取資料進行 AI 分析")
        return False

async def main():
    """執行所有測試"""
    print("\n" + "🚀" * 30)
    print("CoinGecko API & AI 整合測試")
    print("🚀" * 30 + "\n")
    
    results = []
    
    # 執行所有測試
    results.append(await test_crypto_price())
    results.append(await test_ethereum_price())
    results.append(await test_trending())
    results.append(await test_search())
    results.append(await test_ai_response())
    
    # 顯示測試結果摘要
    print("\n" + "=" * 60)
    print("📊 測試結果摘要")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"通過: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 所有測試通過!")
        print("✅ CoinGecko API 整合正常運作")
        print("✅ AI 分析功能正常運作")
        print("\n💡 你現在可以啟動 Chainlit 服務:")
        print("   chainlit run app.py --host 0.0.0.0 --port 8000")
    else:
        print(f"\n⚠️  {total - passed} 個測試失敗")
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  測試被使用者中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ 測試過程發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
