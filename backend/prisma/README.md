# Prisma Database Seeding Guide

本文件說明如何使用 Prisma 假資料模組填充資料庫。

## 📋 功能特色

### 🎯 支援的資料類型

- **👥 用戶 (Users)**: 管理員、一般用戶，包含完整的員工資訊
- **🪙 加密貨幣 (Crypto)**: 15種主流加密貨幣，含價格和市場數據
- **📝 文章 (Posts)**: 加密貨幣相關文章和分析
- **👀 追蹤清單 (Watchlists)**: 用戶關注的加密貨幣列表

### 🔧 兩種 Seeder 版本

1. **簡化版 (`seed-simple.ts`)**:
   - 穩定可靠，使用固定資料
   - 快速執行，適合開發測試
   - 5個用戶 + 15個加密貨幣 + 3篇文章 + 7個追蹤項目

2. **完整版 (`seed.ts`)**:
   - 使用 Faker.js 生成大量隨機資料
   - 可配置數據量
   - 25個用戶 + 15個加密貨幣 + 25篇文章 + 大量追蹤項目

## 🚀 快速開始

### 1. 執行基本 Seeding

```bash
# 生成 Prisma Client 並執行 seeding
npm run prisma:seed:dev

# 或者只執行 seeding
npm run prisma:seed
```

### 2. 重置資料庫並重新 Seed

```bash
# 重置資料庫遷移並重新填入假資料
npm run db:reset-seed
```

### 3. 其他有用的命令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 查看資料庫 GUI
npm run prisma:studio

# 重置資料庫
npm run prisma:reset
```

## 🔐 預設測試帳號

### 管理員帳號
- **Email**: `admin@cryptoplace.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

- **Email**: `manager@cryptoplace.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### 一般用戶帳號
- **Email**: `alice@cryptoplace.com`
- **Password**: `user123`
- **Role**: `USER`

- **Email**: `bob@cryptoplace.com`
- **Password**: `user123`
- **Role**: `USER`

- **Email**: `charlie@cryptoplace.com`
- **Password**: `user123`
- **Role**: `USER`

## 📊 資料結構說明

### Users 表
```typescript
{
  id: number
  email: string (unique)
  name: string
  password: string (bcrypt hashed)
  role: 'USER' | 'ADMIN'
  isActive: boolean
  // 員工資訊欄位
  emplId, enName, chName, jobTitle, phone, office,
  deptId, deptDescr, supvEmplId, site, emplCategoryA,
  bg, fnLvl1, fnLvl2, deptRoleName, deptRoleAbbr
}
```

### Crypto 表
```typescript
{
  id: string (e.g., 'bitcoin')
  symbol: string (e.g., 'BTC')
  name: string (e.g., 'Bitcoin')
  image?: string (logo URL)
  currentPrice?: number
  marketCap?: number
  volume24h?: number
  priceChange24h?: number
}
```

### Posts 表
```typescript
{
  id: number
  title: string
  content?: string
  authorId: number (FK to users)
  order: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Watchlists 表
```typescript
{
  id: number
  userId: number (FK to users)
  coinId: string (FK to crypto)
  coinName: string
  symbol: string
  image?: string
  createdAt: DateTime
}
```

## ⚙️ 自定義配置

### 修改 seed 配置 (完整版)

編輯 `prisma/seed.ts` 中的 `SEED_CONFIG`:

```typescript
const SEED_CONFIG = {
  CLEAR_DATABASE: true,           // 是否清除現有資料
  GENERATE_ADDITIONAL_USERS: true,    // 是否生成額外用戶
  ADDITIONAL_USER_COUNT: 20,      // 額外用戶數量
  GENERATE_POSTS: true,           // 是否生成文章
  POST_COUNT: 25,                 // 文章數量
  GENERATE_WATCHLISTS: true,      // 是否生成追蹤清單
  PRICE_VARIATION_ENABLED: true, // 是否啟用價格變動
}
```

### 新增自定義資料

1. **新增用戶**: 編輯 `prisma/seed-datas/user-data.ts`
2. **新增加密貨幣**: 編輯 `prisma/seed-datas/crypto-data.ts`
3. **新增文章模板**: 編輯 `prisma/seed-datas/post-data.ts`

## 🛠️ 開發說明

### 檔案結構
```
prisma/
├── schema.prisma           # Prisma 資料庫 schema
├── seed.ts                 # 完整版 seeder (使用 Faker.js)
├── seed-simple.ts          # 簡化版 seeder (推薦)
├── README.md              # 本說明文件
└── seed-datas/            # 種子資料模組
    ├── user-data.ts       # 用戶資料
    ├── crypto-data.ts     # 加密貨幣資料
    └── post-data.ts       # 文章資料
```

### 依賴套件
- `@prisma/client`: Prisma ORM 客戶端
- `@faker-js/faker`: 假資料生成器
- `bcryptjs`: 密碼加密
- `ts-node`: TypeScript 執行環境

## 🔍 常見問題

### Q: Seeding 失敗怎麼辦？
A:
1. 確認資料庫連線正常
2. 檢查 `.env` 檔案中的 `DATABASE_URL`
3. 執行 `npm run prisma:generate` 重新生成客戶端
4. 使用 `npm run prisma:reset` 重置資料庫

### Q: 如何查看生成的資料？
A:
- 使用 `npm run prisma:studio` 開啟 Prisma Studio
- 或直接連接你的資料庫管理工具

### Q: 如何只填入特定類型的資料？
A: 修改 `seed-simple.ts` 中的主函數，註釋掉不需要的 seed 函數調用

### Q: 密碼是如何加密的？
A: 使用 bcryptjs 進行加密，鹽值輪數為 10。所有測試帳號密碼都已正確加密存儲。

## 📝 注意事項

- **資料庫清理**: Seeding 會先清除現有資料，請謹慎使用
- **密碼安全**: 測試環境密碼簡單，生產環境請使用強密碼
- **外鍵約束**: 刪除資料時會自動處理外鍵約束順序
- **Upsert 策略**: 使用 upsert 避免重複資料，以 email 和 id 為唯一鍵

## 🎯 最佳實踐

1. **開發時**: 使用 `seed-simple.ts` 快速填入基本資料
2. **測試時**: 使用完整版 `seed.ts` 生成大量測試資料
3. **生產前**: 確保移除或保護 seeding 腳本
4. **備份**: 重要資料執行 seeding 前先備份資料庫

---

Happy Coding! 🚀