// React Scan 配置文件
interface ReactScanLogOptions {
  renderReasons: boolean;
  renderTime: boolean;
  propsChanges: boolean;
  stateChanges: boolean;
}

interface ReactScanPerformance {
  slowRenderThreshold: number;
  frequentRenderThreshold: number;
}

interface ReactScanConfig {
  enabled: boolean;
  log: boolean;
  showToolbar: boolean;
  highlight: boolean;
  logOptions: ReactScanLogOptions;
  performance: ReactScanPerformance;
  exclude: RegExp[];
  include: RegExp[];
}

export const reactScanConfig: ReactScanConfig = {
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

export const initReactScan = async (): Promise<void> => {
  if (import.meta.env.DEV) {
    try {
      const { scan } = await import('react-scan');

      scan(reactScanConfig);

      // eslint-disable-next-line no-console
      console.log('🔍 React Scan 已啟用');
      // eslint-disable-next-line no-console
      console.log('📊 監控配置:', reactScanConfig);
      // eslint-disable-next-line no-console
      console.log('💡 提示: 打開開發者工具查看重新渲染分析');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('React Scan 初始化失敗:', error);
    }
  }
};
