import React from 'react';

interface MarketData {
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_14d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_60d?: number;
  price_change_percentage_1y?: number;
}

interface CryptoDataWithMarketData {
  market_data?: MarketData;
}

interface PerformanceTableProps {
  cryptoData?: CryptoDataWithMarketData | null;
  chartData?: CryptoDataWithMarketData | null;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({
  cryptoData,
  chartData,
}) => {
  // 兼容不同的數據來源
  const data = cryptoData || chartData;

  // 如果沒有數據或沒有 market_data，顯示加載狀態
  if (!data || !data.market_data) {
    return (
      <div className='overflow-x-auto rounded-xl border border-gray-300 mb-5'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-center'>
            <div className='w-8 h-8 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
              <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
            </div>
            <p className='text-gray-500 text-sm'>Loading performance data...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '0.00';
    return value.toFixed(2);
  };

  const getPercentageClass = (value: number | undefined): string => {
    return (value || 0) >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPercentagePrefix = (value: number | undefined): string => {
    return (value || 0) >= 0 ? '+' : '';
  };

  return (
    <div className='overflow-x-auto rounded-xl border border-gray-300 mb-5'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              24h
            </th>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              7d
            </th>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              14d
            </th>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              30d
            </th>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              60d
            </th>
            <th className='px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900'>
              1y
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          <tr>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_24h)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_24h
              )}
              {formatPercentage(data.market_data?.price_change_percentage_24h)}%
            </td>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_7d)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_7d
              )}
              {formatPercentage(data.market_data?.price_change_percentage_7d)}%
            </td>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_14d)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_14d
              )}
              {formatPercentage(data.market_data?.price_change_percentage_14d)}%
            </td>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_30d)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_30d
              )}
              {formatPercentage(data.market_data?.price_change_percentage_30d)}%
            </td>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_60d)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_60d
              )}
              {formatPercentage(data.market_data?.price_change_percentage_60d)}%
            </td>
            <td
              className={`px-2 py-2 whitespace-nowrap text-center text-sm font-medium ${getPercentageClass(data.market_data?.price_change_percentage_1y)}`}
            >
              {getPercentagePrefix(
                data.market_data?.price_change_percentage_1y
              )}
              {formatPercentage(data.market_data?.price_change_percentage_1y)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;
