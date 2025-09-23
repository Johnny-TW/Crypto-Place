import React, { useState, useEffect, useCallback } from 'react';
import { APIKit } from '../../redux/api/apiService';
import { SIMPLE_PRICE } from '../../redux/api/api';

interface SimplePriceData {
  [coinId: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
  };
}

interface CoinInfo {
  id: string;
  name: string;
  symbol: string;
}

const SimplePrice: React.FC = () => {
  const [priceData, setPriceData] = useState<SimplePriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([
    'bitcoin',
    'ethereum',
    'binancecoin',
    'cardano',
    'solana',
  ]);

  const coinOptions: CoinInfo[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  ];

  const fetchSimplePrice = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ids: selectedCoins.join(','),
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
        include_market_cap: 'true',
      });

      const response = await APIKit.get(`${SIMPLE_PRICE}?${queryParams}`);
      setPriceData(response.data);
      setError(null);
    } catch (err) {
      setError('獲取價格數據失敗');
      console.error('Error fetching simple price:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCoins]);

  useEffect(() => {
    fetchSimplePrice();
    const interval = setInterval(fetchSimplePrice, 30000);
    return () => clearInterval(interval);
  }, [fetchSimplePrice]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value > 1 ? 2 : 6,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
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

  const getCoinInfo = (coinId: string): CoinInfo => {
    return (
      coinOptions.find(coin => coin.id === coinId) || {
        id: coinId,
        name: coinId,
        symbol: coinId.toUpperCase(),
      }
    );
  };

  const handleCoinToggle = (coinId: string) => {
    setSelectedCoins(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  if (loading && !priceData) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
        <span className='ml-2 text-gray-600'>載入價格數據中...</span>
      </div>
    );
  }

  if (error && !priceData) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <p className='text-red-600'>{error}</p>
        <button
          type='button'
          onClick={fetchSimplePrice}
          className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>即時價格追蹤</h2>
        <div className='flex items-center space-x-2'>
          {loading ? (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' />
          ) : null}
          <span className='text-sm text-gray-500'>每30秒自動更新</span>
        </div>
      </div>

      {/* 幣種選擇器 */}
      <div className='mb-6 p-4 rounded-lg'>
        <h3 className='text-sm font-medium text-gray-700 mb-3'>
          選擇要追蹤的幣種：
        </h3>
        <div className='flex flex-wrap gap-2'>
          {coinOptions.map(coin => (
            <button
              key={coin.id}
              type='button'
              onClick={() => handleCoinToggle(coin.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCoins.includes(coin.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {coin.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* 價格數據展示 */}
      {priceData ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Object.entries(priceData).map(([coinId, data]) => {
            const coinInfo = getCoinInfo(coinId);
            return (
              <div
                key={coinId}
                className='bg-gradient-to-br rounded-lg p-4 border border-gray-200 transition-shadow duration-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <h3 className='font-bold text-gray-800'>{coinInfo.name}</h3>
                    <p className='text-sm text-gray-500 uppercase'>
                      {coinInfo.symbol}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-xl font-bold text-blue-600'>
                      {formatCurrency(data.usd)}
                    </div>
                    {data.usd_24h_change !== undefined && (
                      <div className='text-sm'>
                        {formatPercentage(data.usd_24h_change)}
                      </div>
                    )}
                  </div>
                </div>

                <div className='space-y-2 pt-3 border-t border-gray-200'>
                  {data.usd_market_cap ? (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>市值:</span>
                      <span className='font-medium text-gray-800'>
                        ${formatLargeNumber(data.usd_market_cap)}
                      </span>
                    </div>
                  ) : null}
                  {data.usd_24h_vol ? (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>24h成交量:</span>
                      <span className='font-medium text-gray-800'>
                        ${formatLargeNumber(data.usd_24h_vol)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!priceData && !loading && (
        <div className='text-center p-8 text-gray-500'>暫無價格數據</div>
      )}
    </div>
  );
};

export default SimplePrice;
