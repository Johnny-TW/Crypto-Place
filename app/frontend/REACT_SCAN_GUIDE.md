# React Scan 使用指南

## 🔍 什麼是 React Scan？

React Scan 是一個用於檢測 React 應用程式中不必要重新渲染的工具，可以幫助您：
- 可視化組件的重新渲染
- 識別性能瓶頸
- 找出重新渲染的原因
- 優化應用程式性能

## 🚀 如何使用

### 1. 啟動開發伺服器
```bash
npm run dev
```

### 2. 打開瀏覽器
訪問 http://localhost:5174/

### 3. 打開開發者工具
- 按 `F12` 或 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- 切換到 `Console` 標籤頁

### 4. 查看 React Scan 輸出
您應該會看到：
```
🔍 React Scan 已啟用
📊 監控配置: [配置物件]
💡 提示: 打開開發者工具查看重新渲染分析
```

## 📊 監控功能

### 視覺化高亮
- **綠色框**: 組件正在渲染
- **紅色框**: 組件頻繁重新渲染（性能問題）
- **黃色框**: 組件渲染時間較長

### 控制台日誌
React Scan 會在控制台顯示：
- 組件名稱和渲染次數
- 渲染原因（props 變化、state 變化等）
- 渲染時間
- 性能警告

### 工具列
在頁面右上角會顯示 React Scan 工具列，包含：
- 渲染統計
- 性能指標
- 設定選項

## 🎯 重點監控的組件

當前配置重點監控以下組件：
- `Dashboard` - 儀表板組件
- `Navbar` - 導航列組件
- `Chart` - 圖表組件
- `Card` - 卡片組件

## 🔧 性能警告

### 慢渲染警告
- 當組件渲染時間超過 **16ms** 時會顯示警告
- 這可能導致 60fps 的流暢度問題

### 頻繁渲染警告
- 當組件在 **1秒內渲染超過5次** 時會顯示警告
- 這通常表示有不必要的重新渲染

## 🐛 如何解讀結果

### 1. 檢查重新渲染原因
```
Component: Navbar
Renders: 5
Reason: props.employeeInfo changed
```

### 2. 識別問題模式
- **Props 變化**: 檢查是否傳遞了不穩定的引用
- **State 變化**: 檢查 useState 或 useReducer 的使用
- **Context 變化**: 檢查 Context 的值是否頻繁變化

### 3. 常見解決方案
- 使用 `React.memo` 包裝純組件
- 使用 `useMemo` 緩存昂貴的計算
- 使用 `useCallback` 穩定函數引用
- 優化 Redux store 結構

## 📈 優化建議

### 優先處理順序
1. **紅色高亮的組件** - 最緊急，影響用戶體驗
2. **頻繁渲染的組件** - 次要，但影響電池壽命
3. **慢渲染的組件** - 長期優化目標

### 常見優化技巧
```javascript
// 1. 使用 React.memo
const MyComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});

// 2. 使用 useMemo 緩存計算
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// 3. 使用 useCallback 穩定函數
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## 🔧 自訂設定

如需修改監控設定，請編輯：
`src/utils/react-scan-config.js`

### 可調整項目：
- `slowRenderThreshold`: 慢渲染閾值（毫秒）
- `frequentRenderThreshold`: 頻繁渲染閾值（次數/秒）
- `exclude`: 排除監控的組件
- `include`: 只監控特定組件

## 🚨 注意事項

1. **只在開發模式下啟用** - React Scan 不會在生產環境中運行
2. **可能影響開發性能** - 監控本身會消耗一些資源
3. **建議分段測試** - 一次只關注幾個組件，避免訊息過載

## 📚 更多資源

- [React Scan GitHub](https://github.com/aidenybai/react-scan)
- [React 性能優化指南](https://react.dev/learn/render-and-commit)
- [React Profiler 工具](https://react.dev/reference/react/Profiler)

---

現在您可以開始使用 React Scan 來分析和優化您的 React 應用程式性能了！🎉