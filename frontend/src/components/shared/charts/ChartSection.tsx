import React, { useMemo, memo } from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

interface CoinChartData {
  prices?: Array<[number, number]>;
  last_updated?: string;
}

interface ChartSectionProps {
  coinChartData: CoinChartData;
  timeRange: '7d' | '30d' | '1y';
  setTimeRange: (_range: '7d' | '30d' | '1y') => void;
}

interface MarginConfig {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface ChartData {
  dataPoints: number[];
  labels: string[];
}

interface Stats {
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

const getMarginConfig = (timeRange: string): MarginConfig => {
  return timeRange === '30d'
    ? { left: 70, right: 30, top: 30, bottom: 100 }
    : { left: 20, right: 30, top: 30, bottom: 100 };
};

const formatPriceForAxis = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const generateConsistentPrice = (
  coinChartData: CoinChartData,
  daysFromToday: number
): number => {
  // 優先使用真實數據
  if (coinChartData.prices && coinChartData.prices.length > 0) {
    // CoinGecko API 返回的 prices 數組是按時間順序排列的
    // 最新的價格在數組末尾，所以需要從後往前計算索引
    const realIndex = coinChartData.prices.length - 1 - daysFromToday;

    // 確保索引在有效範圍內
    if (realIndex >= 0 && realIndex < coinChartData.prices.length) {
      const priceEntry = coinChartData.prices[realIndex];
      if (priceEntry && priceEntry.length >= 2) {
        const price = parseFloat(priceEntry[1].toString());
        return price;
      }
    }
  }

  // 生成一致的模擬價格 - 基於距離今天的天數
  const basePrice = 50000;

  // 使用 daysFromToday 確保今天 (daysFromToday=0) 在所有模式下都是同樣的價格
  const normalizedDay = Math.abs(daysFromToday); // 確保正數

  // 基於距離今天的天數計算價格組件
  const trendComponent = Math.sin(normalizedDay * 0.02) * 3000; // 長期趨勢
  const volatilityComponent = Math.cos(normalizedDay * 0.1) * 2000; // 中期波動
  const microComponent = Math.sin(normalizedDay * 0.5) * 500; // 短期微調

  // 今天的基準調整 - 確保今天價格在合理範圍
  const todayAdjustment = daysFromToday === 0 ? 2000 : 0;

  return (
    basePrice +
    trendComponent +
    volatilityComponent +
    microComponent +
    todayAdjustment
  );
};

const generateChartData = (
  coinChartData: CoinChartData,
  timeRange: string
): ChartData => {
  const lastUpdated = coinChartData.last_updated
    ? new Date(coinChartData.last_updated)
    : new Date();

  const dataPoints: number[] = [];
  const labels: string[] = [];

  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];

  const days: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '1y': 365,
  };

  const targetDays = days[timeRange] || 30;

  if (timeRange === '1y') {
    // 改進的 1Y 視圖實現 - 將數據點聚合為月度數據
    const monthlyData: Record<string, { prices: number[]; label: string }> = {};

    // 首先收集所有數據
    for (let i = targetDays - 1; i >= 0; i -= 1) {
      const date = new Date(lastUpdated);
      date.setDate(date.getDate() - i);

      const month = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${year}-${month}`;

      const price = generateConsistentPrice(coinChartData, i);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          prices: [],
          label: `${monthNames[month]} ${year}`,
        };
      }

      monthlyData[monthKey].prices.push(price);
    }

    // 然後轉換為圖表需要的格式
    Object.keys(monthlyData)
      .sort()
      .forEach(monthKey => {
        // 使用每月平均價格作為數據點
        const monthPrices = monthlyData[monthKey].prices;
        const avgPrice =
          monthPrices.reduce((sum, price) => sum + price, 0) /
          monthPrices.length;

        dataPoints.push(avgPrice);
        labels.push(monthlyData[monthKey].label);
      });

    return { dataPoints, labels };
  }

  // 7d 和 30d 優化顯示 - 根據時間範圍採樣數據點
  if (timeRange === '7d') {
    // 7D: 顯示每天的數據
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(lastUpdated);
      date.setDate(date.getDate() - i);

      const price = generateConsistentPrice(coinChartData, i);

      dataPoints.push(price);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      labels.push(`${month}-${day}`);
    }
  } else if (timeRange === '30d') {
    // 30D: 顯示從30天前到今天的完整範圍，每3天採樣一次
    const sampleDays: number[] = [];
    for (let i = 29; i >= 0; i -= 3) {
      sampleDays.push(i);
    }
    // 確保包含最後一天（今天）
    if (sampleDays[sampleDays.length - 1] !== 0) {
      sampleDays.push(0);
    }

    sampleDays.forEach(daysAgo => {
      const date = new Date(lastUpdated);
      date.setDate(date.getDate() - daysAgo);

      const price = generateConsistentPrice(coinChartData, daysAgo);

      dataPoints.push(price);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      labels.push(`${month}-${day}`);
    });
  }

  return { dataPoints, labels };
};

const ChartSection: React.FC<ChartSectionProps> = memo(
  ({ coinChartData, timeRange, setTimeRange }) => {
    const theme = useTheme();
    const days: Array<'7d' | '30d' | '1y'> = ['7d', '30d', '1y'];

    // 將所有 useMemo 移到條件語句之前，確保它們總是被調用
    // 1. 生成圖表數據
    const { dataPoints, labels } = useMemo(() => {
      // 如果數據不可用，返回空數組
      if (
        !coinChartData ||
        !coinChartData.prices ||
        coinChartData.prices.length === 0
      ) {
        return { dataPoints: [], labels: [] };
      }
      return generateChartData(coinChartData, timeRange);
    }, [coinChartData, timeRange]);

    // 2. 計算價格變化統計
    const stats = useMemo((): Stats => {
      if (!dataPoints || dataPoints.length < 2) {
        return { change: 0, changePercent: 0, trend: 'neutral' };
      }

      const firstPrice = dataPoints[0];
      const lastPrice = dataPoints[dataPoints.length - 1];
      const change = lastPrice - firstPrice;
      const changePercent = (change / firstPrice) * 100;
      let trend: 'up' | 'down' | 'neutral';

      if (change > 0) {
        trend = 'up';
      } else if (change < 0) {
        trend = 'down';
      } else {
        trend = 'neutral';
      }

      return { change, changePercent, trend };
    }, [dataPoints]);

    // 3. 根據時間範圍定義 X 軸配置
    const xAxisConfig = useMemo(() => {
      const config = {
        scaleType: 'point' as const,
        data: labels,
        valueFormatter: (value: string) => value || '',
      };

      // 針對不同的時間範圍添加特定的配置
      const configWithInterval = {
        ...config,
        tickInterval: undefined as
          | ((_value: string, _index: number) => boolean)
          | undefined,
      };

      if (timeRange === '7d') {
        // 7D: 顯示所有日期標籤 (7個點)
        configWithInterval.tickInterval = (_, index) => index % 1 === 0;
      } else if (timeRange === '30d') {
        // 30D: 顯示所有標籤 (約10個點)
        configWithInterval.tickInterval = (_, index) => index % 1 === 0;
      }
      // 1Y 視圖不需要特殊的 tickInterval，因為我們已經把數據聚合為月份

      return configWithInterval;
    }, [labels, timeRange]);

    // 顯示加載狀態 - 只有在 coinChartData 為 null 或 undefined 時才顯示
    if (!coinChartData) {
      return (
        <Card
          elevation={0}
          sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Box className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                  <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                </div>
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Loading chart data...
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Please wait while we fetch the latest market data
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>
      );
    }

    // 檢查生成的數據點
    if (!dataPoints || dataPoints.length === 0) {
      return (
        <Card
          elevation={0}
          sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Box className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  No chart data available
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Raw data points: {coinChartData?.prices?.length || 0}
                </Typography>
              </div>
            </Box>
          </CardContent>
        </Card>
      );
    }

    const handleTimeRangeChange = (range: '7d' | '30d' | '1y') => {
      // 優化：只更新狀態，不觸發 API 請求
      setTimeRange(range);
    };

    return (
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Header with Price Stats */}
        <CardContent sx={{ pb: 0 }}>
          <Box className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div>
              <Typography variant='h5' fontWeight={600} gutterBottom>
                Price Chart
              </Typography>
              <Box className='flex items-center gap-2'>
                <Typography variant='h4' fontWeight={700}>
                  $
                  {dataPoints[dataPoints.length - 1]?.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || 'N/A'}
                </Typography>
                <Chip
                  icon={(() => {
                    if (stats.trend === 'up') {
                      return <TrendingUp />;
                    }
                    if (stats.trend === 'down') {
                      return <TrendingDown />;
                    }
                    return <Remove />;
                  })()}
                  label={`${stats.changePercent > 0 ? '+' : ''}${stats.changePercent.toFixed(2)}%`}
                  color={(() => {
                    if (stats.trend === 'up') {
                      return 'success';
                    }
                    if (stats.trend === 'down') {
                      return 'error';
                    }
                    return 'default';
                  })()}
                  variant='filled'
                  size='small'
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {(() => {
                  if (stats.trend === 'up') {
                    return '+';
                  }
                  if (stats.trend === 'down') {
                    return '';
                  }
                  return '';
                })()}
                $
                {Math.abs(stats.change).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                ({timeRange})
              </Typography>
            </div>

            {/* Modern Tab-style Time Range Selector */}
            <Box className='flex bg-gray-100 rounded-lg p-1 gap-1 mt-4 sm:mt-0'>
              {days.map(range => (
                <button
                  type='button'
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </Box>
          </Box>
        </CardContent>

        <Divider />

        {/* Chart Area */}
        <CardContent sx={{ pt: 2 }}>
          <Box sx={{ height: 420 }}>
            <LineChart
              height={420}
              series={[
                {
                  data: dataPoints,
                  label: 'Price (USD)',
                  color: (() => {
                    if (stats.trend === 'up') {
                      return '#10b981';
                    }
                    if (stats.trend === 'down') {
                      return '#ef4444';
                    }
                    return theme.palette.primary.main;
                  })(),
                  showMark: false,
                  curve: 'natural',
                  area: true,
                },
              ]}
              xAxis={[xAxisConfig]}
              yAxis={[
                {
                  valueFormatter:
                    timeRange === '30d'
                      ? (value: number) => formatPriceForAxis(value)
                      : () => '',
                  disableTicks: timeRange !== '30d',
                  disableLine: timeRange !== '30d',
                  tickLabelStyle:
                    timeRange === '30d'
                      ? { fontSize: '0.75rem' }
                      : { display: 'none' },
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  strokeWidth: 3,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                },
                // Conditionally hide/show Y-axis based on time range
                '& .MuiChartsYAxis-root': {
                  display: timeRange === '30d' ? 'block' : 'none !important',
                },
                '& .MuiChartsAxis-directionY': {
                  display: timeRange === '30d' ? 'block' : 'none !important',
                },
                '& .MuiChartsAxis-left': {
                  display: timeRange === '30d' ? 'block' : 'none !important',
                },
                // Style Y-axis labels when visible
                ...(timeRange === '30d' && {
                  '& .MuiChartsYAxis-root .MuiChartsAxis-tickLabel': {
                    fontSize: '0.75rem',
                    fill: theme.palette.text.secondary,
                    fontWeight: 400,
                  },
                  '& .MuiChartsYAxis-root .MuiChartsAxis-line': {
                    stroke: theme.palette.divider,
                  },
                  '& .MuiChartsYAxis-root .MuiChartsAxis-tick': {
                    stroke: theme.palette.divider,
                  },
                }),
                // Keep X-axis labels visible
                '& .MuiChartsXAxis-root .MuiChartsAxis-tickLabel': {
                  fontSize: '0.75rem',
                  fill: theme.palette.text.secondary,
                  ...(timeRange === '1y'
                    ? {
                        transform: 'translateY(10px)',
                        textAnchor: 'middle',
                      }
                    : {
                        transform: 'rotate(-45deg) translateX(-20px)',
                        textAnchor: 'end',
                      }),
                },
                '& .MuiChartsXAxis-root .MuiChartsAxis-line': {
                  stroke: theme.palette.divider,
                },
                '& .MuiChartsXAxis-root .MuiChartsAxis-tick': {
                  stroke: theme.palette.divider,
                },
                // Grid lines
                '& .MuiChartsGrid-line': {
                  stroke: theme.palette.divider,
                  strokeDasharray: '3 3',
                  opacity: 0.5,
                },
                // Hover effects
                '& .MuiChartsTooltip-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  '& .MuiChartsTooltip-labelCell': {
                    color: 'white',
                  },
                  '& .MuiChartsTooltip-valueCell': {
                    color: 'white',
                    fontWeight: 600,
                  },
                },
              }}
              margin={getMarginConfig(timeRange)}
              grid={{ vertical: true, horizontal: true }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }
);

// 設置 displayName 用於調試
ChartSection.displayName = 'ChartSection';

export default ChartSection;
