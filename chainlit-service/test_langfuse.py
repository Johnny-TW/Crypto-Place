#!/usr/bin/env python3
"""
Langfuse 整合測試腳本
測試 Langfuse 是否正確配置並可以追蹤對話
"""

import os
import sys
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")

print("🔍 Langfuse 連線測試")
print("=" * 50)

# 檢查環境變數
if not LANGFUSE_PUBLIC_KEY or LANGFUSE_PUBLIC_KEY == "your-langfuse-public-key":
    print("❌ LANGFUSE_PUBLIC_KEY 未設定")
    print("   請在 .env 檔案中設定你的 Langfuse Public Key")
    print("   前往 https://cloud.langfuse.com 註冊並取得金鑰")
    sys.exit(1)

if not LANGFUSE_SECRET_KEY or LANGFUSE_SECRET_KEY == "your-langfuse-secret-key":
    print("❌ LANGFUSE_SECRET_KEY 未設定")
    print("   請在 .env 檔案中設定你的 Langfuse Secret Key")
    print("   前往 https://cloud.langfuse.com 註冊並取得金鑰")
    sys.exit(1)

print(f"✅ Public Key: {LANGFUSE_PUBLIC_KEY[:20]}...")
print(f"✅ Secret Key: {LANGFUSE_SECRET_KEY[:20]}...")
print(f"✅ Host: {LANGFUSE_HOST}")
print()

# 嘗試導入 Langfuse
try:
    from langfuse.decorators import observe, langfuse_context
    print("✅ Langfuse 套件已安裝")
except ImportError as e:
    print(f"❌ Langfuse 套件未安裝: {e}")
    print("   請執行: pip install langfuse")
    sys.exit(1)

# 設定環境變數讓 decorators 使用
os.environ["LANGFUSE_PUBLIC_KEY"] = LANGFUSE_PUBLIC_KEY
os.environ["LANGFUSE_SECRET_KEY"] = LANGFUSE_SECRET_KEY
os.environ["LANGFUSE_HOST"] = LANGFUSE_HOST

# 建立測試函數
@observe(name="test_langfuse_integration")
def test_ai_call():
    """測試 Langfuse 追蹤功能"""
    
    # 更新 trace 資訊
    langfuse_context.update_current_trace(
        user_id="test_user",
        metadata={
            "test": True,
            "source": "test_script"
        }
    )
    
    # 模擬 AI 請求
    test_input = {
        "query": "比特幣是什麼？",
        "model": "gemini-2.0-flash"
    }
    
    test_output = "比特幣是一種去中心化的數位貨幣。"
    
    # 更新當前 observation
    langfuse_context.update_current_observation(
        input=test_input,
        output=test_output,
        metadata={
            "status": "success",
            "response_length": len(test_output)
        }
    )
    
    return test_output

# 執行測試
try:
    print("🧪 正在測試 Langfuse 追蹤功能...")
    result = test_ai_call()
    print(f"✅ 測試成功!")
    print(f"   回答: {result}")
    print()
    print("🎉 Langfuse 整合測試完成!")
    print()
    print("📊 請前往 Langfuse Dashboard 查看測試資料:")
    print(f"   {LANGFUSE_HOST}")
    print()
    print("💡 提示: 資料可能需要幾秒鐘才會出現在 Dashboard 上")
    
except Exception as e:
    print(f"❌ 測試失敗: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()
print("=" * 50)
print("✨ 所有測試通過!你的 Langfuse 已正確設定。")
