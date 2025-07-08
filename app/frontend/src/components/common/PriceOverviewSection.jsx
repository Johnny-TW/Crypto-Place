import { ArrowUp, ArrowDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faDollarSign,
  faStore,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

// 格式化數字的輔助函數
const formatNumber = num => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

function PriceOverviewSection({ data }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
      <div className='bg-white rounded-lg border border-gray-300 p-6'>
        <div className='flex justify-between items-center'>
          <FontAwesomeIcon
            icon={faDollarSign}
            className='h-5 w-5 text-gray-500'
          />
          <div className='text-right'>
            <p className='text-sm text-gray-500'>Current Price</p>
            <p className='text-xl font-bold'>
              ${data.market_data.current_price.usd.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg border border-gray-300 p-6'>
        <div className='flex justify-between items-center'>
          <FontAwesomeIcon
            icon={faChartLine}
            className='h-5 w-5 text-gray-500'
          />
          <div className='text-right'>
            <p className='text-sm text-gray-500'>24h Change</p>
            <p
              className={`text-xl font-bold ${data.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {data.market_data.price_change_percentage_24h >= 0 ? (
                <ArrowUp className='inline h-4 w-4 mr-1' />
              ) : (
                <ArrowDown className='inline h-4 w-4 mr-1' />
              )}
              {Math.abs(data.market_data.price_change_percentage_24h).toFixed(
                2
              )}
              %
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg border border-gray-300 p-6'>
        <div className='flex justify-between items-center'>
          <FontAwesomeIcon icon={faStore} className='h-5 w-5 text-gray-500' />
          <div className='text-right'>
            <p className='text-sm text-gray-500'>Market Cap</p>
            <p className='text-xl font-bold'>
              {formatNumber(data.market_data.market_cap.usd)}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg border border-gray-300 p-6'>
        <div className='flex justify-between items-center'>
          <FontAwesomeIcon icon={faCoins} className='h-5 w-5 text-gray-500' />
          <div className='text-right'>
            <p className='text-sm text-gray-500'>24h Volume</p>
            <p className='text-xl font-bold'>
              {formatNumber(data.market_data.total_volume.usd)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceOverviewSection;
