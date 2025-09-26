import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../types/redux';

type TrackingType = 'coins' | 'nfts' | 'categories';

const TrendingCoins: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: trendingData,
    loading,
    error,
  } = useSelector((state: RootState) => state.trendingCoins);
  const [selectedType, setSelectedType] = useState<TrackingType>('coins');
  const [showMoreNfts, setShowMoreNfts] = useState(false);
  const [showMoreCoins, setShowMoreCategories] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_TRENDING_COINS' });
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
        <span className='ml-2 text-gray-600'>Loading...</span>
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

  if (!trendingData) {
    return <div className='text-center p-8 text-gray-500'>暫無追蹤數據</div>;
  }

  const getTitle = () => {
    switch (selectedType) {
      case 'coins':
        return '熱門幣種';
      case 'nfts':
        return '熱門 NFT';
      case 'categories':
        return '熱門分類';
      default:
        return '選擇要追蹤的項目';
    }
  };

  const getPercentageChangeColor = (percentage?: number): string => {
    if (percentage === null || percentage === undefined) {
      return 'text-gray-500';
    }
    return percentage > 0 ? 'text-green-600' : 'text-red-600';
  };

  // console.log(trendingData);

  const renderCoins = () => (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4 w-full'>
      {trendingData.coins
        ?.slice(0, showMoreCoins ? 15 : 6)
        .map((coin: any, index: number) => (
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
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-800 truncate max-w-20'>
                    {coin.item.name}
                  </h3>
                  <p className='text-sm text-gray-500 uppercase'>
                    {(coin.item.symbol || 'N/A').length > 15
                      ? `${(coin.item.symbol || 'N/A').substring(0, 15)}...`
                      : coin.item.symbol || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='text-right flex items-center space-x-3'>
                {coin.data?.sparkline ? (
                  <div className='hidden sm:block'>
                    <img
                      src={coin.data.sparkline}
                      alt={`${coin.item.name} trend`}
                      className='w-16 h-8'
                    />
                  </div>
                ) : null}
                <div>
                  <div className='text-sm text-gray-600'>市值排名</div>
                  <div className='font-bold text-lg text-blue-600'>
                    #{coin.item.market_cap_rank || 'N/A'}
                  </div>
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
  );

  const renderNFTs = () => (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 w-full'>
      {trendingData.nfts
        ?.slice(0, showMoreNfts ? 15 : 6)
        .map((nft: any, index: number) => (
          <div
            key={nft.id}
            className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <img
                    src={nft.thumb}
                    alt={nft.name}
                    className='w-10 h-10 rounded-lg'
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src =
                        'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?';
                    }}
                  />

                  <div className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 truncate max-w-20'>
                    {nft.name}
                  </h3>
                  <p className='text-sm text-gray-500 uppercase'>
                    {' '}
                    {(nft.symbol || 'N/A').length > 15
                      ? `${(nft.symbol || 'N/A').substring(0, 15)}...`
                      : nft.symbol || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-600'>地板價</div>
                <div className='font-bold text-lg text-blue-600'>
                  {nft.floor_price_in_native_currency?.toFixed(4) || 'N/A'}{' '}
                  {nft.native_currency_symbol}
                </div>
              </div>
            </div>

            <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
              <div>
                <span className='text-xs text-gray-500'>24h 變化</span>
                <div
                  className={`font-mono text-sm ${getPercentageChangeColor(
                    nft.floor_price_24h_percentage_change
                  )}`}
                >
                  {nft.floor_price_24h_percentage_change?.toFixed(2) || 'N/A'}%
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderCategories = () => (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 w-full'>
      {trendingData.categories
        ?.slice(0, 6)
        .map((category: any, index: number) => (
          <div
            key={category.id}
            className='bg-gradient-to-r rounded-lg p-4 border border-gray-200 transition-shadow duration-200'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
                    <span className='text-lg'>📈</span>
                  </div>
                  <div className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {index + 1}
                  </div>
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-800 truncate max-w-24'>
                    {category.name}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {category.coins_count} 幣種
                  </p>
                </div>
              </div>
              <div className='text-right flex items-center space-x-3'>
                <div>
                  <div className='text-sm text-gray-600'>1h 變化</div>
                  <div
                    className={`font-bold text-lg ${
                      category.market_cap_1h_change > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {category.market_cap_1h_change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* 顯示額外的數據資訊 */}
            {category.data ? (
              <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
                <div>
                  <span className='text-xs text-gray-500'>市值</span>
                  <div className='font-mono text-sm text-gray-700'>
                    $
                    {category.data.market_cap
                      ? `${(category.data.market_cap / 1e9).toFixed(2)}B`
                      : 'N/A'}
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-xs text-gray-500'>交易量</span>
                  <div className='font-mono text-sm text-gray-700'>
                    $
                    {category.data.total_volume
                      ? `${(category.data.total_volume / 1e9).toFixed(2)}B`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );

  const renderContent = () => {
    switch (selectedType) {
      case 'coins':
        return (
          <>
            {renderCoins()}
            {trendingData?.coins && trendingData.coins.length > 6 ? (
              <div className='flex justify-center mt-6'>
                <button
                  type='button'
                  onClick={() => setShowMoreCategories(!showMoreCoins)}
                >
                  <span>{showMoreCoins ? '顯示較少' : '顯示更多'}</span>
                </button>
              </div>
            ) : null}
          </>
        );
      case 'nfts':
        return (
          <>
            {renderNFTs()}
            {trendingData?.nfts && trendingData.nfts.length > 6 ? (
              <div className='flex justify-center mt-6'>
                <button
                  type='button'
                  onClick={() => setShowMoreNfts(!showMoreNfts)}
                >
                  <span>{showMoreNfts ? '顯示較少' : '顯示更多'}</span>
                </button>
              </div>
            ) : null}
          </>
        );
      case 'categories':
        return renderCategories();
      default:
        return null;
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 max-w-full'>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-2xl font-bold text-gray-800'>{getTitle()}</h3>
          <span className='text-sm text-gray-500'>最近7天熱門搜尋</span>
        </div>

        <div className='flex flex-wrap gap-3 mb-6'>
          <button
            type='button'
            onClick={() => setSelectedType('coins')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedType === 'coins'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span>熱門幣種</span>
            <span className='bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm'>
              {trendingData.coins?.length || 0}
            </span>
          </button>

          <button
            type='button'
            onClick={() => setSelectedType('nfts')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedType === 'nfts'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span>熱門 NFT</span>
            <span className='bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm'>
              {trendingData.nfts?.length || 0}
            </span>
          </button>

          <button
            type='button'
            onClick={() => setSelectedType('categories')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedType === 'categories'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span>熱門分類</span>
            <span className='bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm'>
              {trendingData.categories?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {renderContent()}

      {!renderContent() && (
        <div className='text-center p-8 text-gray-500'>
          {selectedType === 'coins' && '暫無熱門幣種數據'}
          {selectedType === 'nfts' && '暫無熱門 NFT 數據'}
          {selectedType === 'categories' && '暫無熱門分類數據'}
        </div>
      )}
    </div>
  );
};

export default TrendingCoins;
