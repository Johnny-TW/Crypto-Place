import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';

interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      usd: number;
      btc: number;
      eth: number;
    };
    total_volume: {
      usd: number;
      btc: number;
      eth: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
      [key: string]: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

// 自定義 Tooltip 組件 (移到組件外部避免重複渲染)
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
        <p className='font-bold text-gray-800'>{payload[0].name}</p>
        <p className='text-blue-600 font-semibold'>
          {payload[0].value.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

interface GlobalMarketDataProps {
  data: GlobalMarketData | null;
  loading: boolean;
  error: string | null;
}

const GlobalMarketData: React.FC<GlobalMarketDataProps> = ({
  data: globalData,
  loading,
  error,
}) => {
  // 定義圖表顏色配置 (移到頂層)
  const COLORS = React.useMemo(
    () => [
      '#F7931A', // Bitcoin - Orange
      '#627EEA', // Ethereum - Blue
      '#26A17B', // Tether - Green
      '#345D9D', // BNB - Yellow-Blue
      '#2775CA', // Solana - Purple
      '#7C3AED', // Others - Violet
    ],
    []
  );

  // 準備市場主導率圓餅圖數據 (移到頂層，使用可選鏈)
  const dominanceData = useMemo(() => {
    if (!globalData?.data?.market_cap_percentage) return [];

    return Object.entries(globalData.data.market_cap_percentage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([symbol, percentage]) => ({
        name: symbol.toUpperCase(),
        value: parseFloat(percentage.toFixed(2)),
      }));
  }, [globalData]);

  // Chart 配置 (移到頂層)
  const chartConfig: ChartConfig = useMemo(() => {
    return dominanceData.reduce((accumulator, item, index) => {
      return {
        ...accumulator,
        [item.name.toLowerCase()]: {
          label: item.name,
          color: COLORS[index] || '#6B7280',
        },
      };
    }, {} as ChartConfig);
  }, [dominanceData, COLORS]);

  const formatCurrency = (value: number, currency = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span
        className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
      >
        {isPositive ? '+' : ''}
        {value.toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
        <span className='ml-2 text-gray-600'>載入市場數據中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  if (!globalData?.data) {
    return <div className='text-center p-8 text-gray-500'>暫無市場數據</div>;
  }

  const { data } = globalData;

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>全球市場概覽</h2>
        <div className='text-sm text-gray-500'>
          最後更新: {new Date(data.updated_at * 1000).toLocaleString('zh-TW')}
        </div>
      </div>

      {/* 核心市場指標 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium mb-1'>總市值</h3>
              <div className='text-2xl font-bold'>
                {formatCurrency(data.total_market_cap.usd)}
              </div>
              <div className='text-sm text-blue-600 mt-1'>
                24h 變化:{' '}
                {formatPercentage(data.market_cap_change_percentage_24h_usd)}
              </div>
            </div>
            <div className='text-3xl' />
          </div>
        </div>

        <div className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium mb-1'>24小時交易量</h3>
              <div className='text-2xl font-bold'>
                {formatCurrency(data.total_volume.usd)}
              </div>
              <div className='text-sm mt-1'>
                {formatCurrency(data.total_volume.btc, 'BTC')} BTC
              </div>
            </div>
            <div className='text-3xl' />
          </div>
        </div>

        <div className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium  mb-1'>活躍加密貨幣</h3>
              <div className='text-2xl font-bold'>
                {data.active_cryptocurrencies.toLocaleString()}
              </div>
              <div className='text-sm mt-1'>
                交易所: {data.markets.toLocaleString()}
              </div>
            </div>
            <div className='text-3xl' />
          </div>
        </div>

        <div className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium'>ICO 狀態</h3>
              <div className='text-lg font-bold'>
                進行中: {data.ongoing_icos}
              </div>
              <div className='text-sm mt-1'>
                已結束: {data.ended_icos.toLocaleString()}
              </div>
            </div>
            <div className='text-3xl' />
          </div>
        </div>
      </div>

      {/* 市場主導率 */}
      <div className='rounded-lg p-6 bg-gradient-to-br'>
        <h3 className='text-lg font-semibold text-gray-800 mb-6'>
          市場主導率分佈
        </h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 圓餅圖 */}
          <div className='flex items-center justify-center'>
            <ChartContainer config={chartConfig} className='h-[300px] w-full'>
              <PieChart>
                <Pie
                  data={dominanceData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {dominanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign='bottom'
                  height={36}
                  formatter={value => value.toUpperCase()}
                />
              </PieChart>
            </ChartContainer>
          </div>

          {/* 列表顯示 */}
          <div className='flex flex-col justify-center'>
            <div className='space-y-4'>
              {dominanceData.map((item, index) => (
                <div
                  key={item.name}
                  className='flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className='w-4 h-4 rounded-full'
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className='font-semibold text-gray-800'>
                      {item.name}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className='text-xl font-bold'
                      style={{ color: COLORS[index] }}
                    >
                      {item.value}%
                    </span>
                    <div className='w-24 bg-gray-200 rounded-full h-2'>
                      <div
                        className='h-2 rounded-full transition-all duration-500'
                        style={{
                          width: `${Math.min(item.value, 100)}%`,
                          backgroundColor: COLORS[index],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 其他市場統計 */}
      <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200'>
        <div className='text-center'>
          <div className='text-sm text-gray-500 mb-1'>BTC 總市值</div>
          <div className='text-lg font-bold text-orange-600'>
            {formatCurrency(data.total_market_cap.btc, 'BTC')}
          </div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-500 mb-1'>ETH 總市值</div>
          <div className='text-lg font-bold text-blue-600'>
            {formatCurrency(data.total_market_cap.eth, 'ETH')}
          </div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-500 mb-1'>BTC 24h 交易量</div>
          <div className='text-lg font-bold text-orange-600'>
            {formatCurrency(data.total_volume.btc, 'BTC')}
          </div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-500 mb-1'>ETH 24h 交易量</div>
          <div className='text-lg font-bold text-blue-600'>
            {formatCurrency(data.total_volume.eth, 'ETH')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketData;
