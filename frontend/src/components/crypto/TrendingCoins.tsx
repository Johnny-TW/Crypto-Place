import React, { useState, useEffect } from 'react';
import { APIKit } from '../../redux/api/apiService';
import { TRENDING_COINS } from '../../redux/api/api';

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
    score: number;
  };
}

interface TrendingData {
  coins: TrendingCoin[];
  nfts: any[];
  categories: any[];
}

const TrendingCoins: React.FC = () => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        setLoading(true);
        const response = await APIKit.get(TRENDING_COINS);
        setTrendingData(response.data);
        setError(null);
      } catch (err) {
        setError('獲取熱門幣種失敗');
        console.error('Error fetching trending coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
        <span className='ml-2 text-gray-600'>載入熱門幣種中...</span>
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

  if (!trendingData?.coins?.length) {
    return (
      <div className='text-center p-8 text-gray-500'>暫無熱門幣種數據</div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>熱門幣種</h2>
        <span className='ml-2 text-sm text-gray-500'>最近7天熱門搜尋</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {trendingData.coins.slice(0, 6).map((coin, index) => (
          <div
            key={coin.item.id}
            className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <img
                    src={coin.item.thumb}
                    alt={coin.item.name}
                    className='w-10 h-10 rounded-full'
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src =
                        'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?';
                    }}
                  />
                  <div className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 truncate max-w-20'>
                    {coin.item.name}
                  </h3>
                  <p className='text-sm text-gray-500 uppercase'>
                    {coin.item.symbol}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-600'>市值排名</div>
                <div className='font-bold text-lg text-blue-600'>
                  #{coin.item.market_cap_rank || 'N/A'}
                </div>
              </div>
            </div>

            <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
              <div>
                <span className='text-xs text-gray-500'>BTC 價格</span>
                <div className='font-mono text-sm text-gray-700'>
                  {coin.item.price_btc?.toFixed(8) || 'N/A'}
                </div>
              </div>
              <div className='px-2 py-1 rounded-full'>
                <span className='text-xs font-medium text-orange-600'>
                  熱度: {coin.item.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 其他統計信息 */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-blue-600'>
            {trendingData.coins?.length || 0}
          </div>
          <div className='text-sm text-gray-500'>熱門幣種</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-purple-600'>
            {trendingData.nfts?.length || 0}
          </div>
          <div className='text-sm text-gray-500'>熱門 NFT</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {trendingData.categories?.length || 0}
          </div>
          <div className='text-sm text-gray-500'>熱門分類</div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCoins;
