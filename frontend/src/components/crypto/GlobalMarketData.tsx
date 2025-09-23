import React, { useState, useEffect } from 'react';
import { APIKit } from '../../redux/api/apiService';
import { GLOBAL_MARKET_DATA } from '../../redux/api/api';

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

const GlobalMarketData: React.FC = () => {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);
        const response = await APIKit.get(GLOBAL_MARKET_DATA);
        setGlobalData(response.data);
        setError(null);
      } catch (err) {
        setError('獲取全球市場數據失敗');
        console.error('Error fetching global market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
    // 每5分鐘更新一次
    const interval = setInterval(fetchGlobalData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
      <div className='rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>市場主導率</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {Object.entries(data.market_cap_percentage)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([symbol, percentage]) => (
              <div key={symbol} className='text-center'>
                <div className='text-lg font-bold text-gray-800 uppercase'>
                  {symbol}
                </div>
                <div className='text-2xl font-bold text-blue-600'>
                  {percentage.toFixed(1)}%
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
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
