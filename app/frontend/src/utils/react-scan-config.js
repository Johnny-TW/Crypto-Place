// React Scan 配置文件
export const reactScanConfig = {
  enabled: true,
  log: true,
  showToolbar: true,
  highlight: true,
  logOptions: {
    renderReasons: true,
    renderTime: true,
    propsChanges: true,
    stateChanges: true,
  },
  performance: {
    slowRenderThreshold: 16,
    frequentRenderThreshold: 5,
  },
  exclude: [/^Mui/, /^HeadlessUI/, /^Router/, /^Switch/, /^Route/, /Loading/],
  include: [/Dashboard/, /Navbar/, /Chart/, /Card/],
};

export const initReactScan = async () => {
  if (import.meta.env.DEV) {
    try {
      const { scan } = await import('react-scan');

      scan(reactScanConfig);

      /* eslint-disable no-console */
      console.log('🔍 React Scan 已啟用');
      console.log('📊 監控配置:', reactScanConfig);
      console.log('💡 提示: 打開開發者工具查看重新渲染分析');
      /* eslint-enable no-console */
    } catch (error) {
      /* eslint-disable no-console */
      console.warn('React Scan 初始化失敗:', error);
      /* eslint-enable no-console */
    }
  }
};
