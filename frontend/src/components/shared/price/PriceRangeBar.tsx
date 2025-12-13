import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceRangeData {
  current_price: { usd: number };
  high_24h: { usd: number };
  low_24h: { usd: number };
}

interface CryptoData {
  market_data?: PriceRangeData;
}

interface PriceRangeBarProps {
  data: CryptoData | null;
}

const formatPrice = (price: number): string => {
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function PriceRangeBar({ data }: PriceRangeBarProps) {
  if (!data || !data.market_data) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-6 h-full'>
        <div className='h-6 w-32 bg-muted rounded animate-pulse mb-4' />
        <div className='h-3 w-full bg-muted rounded animate-pulse mb-2' />
        <div className='flex justify-between'>
          <div className='h-4 w-20 bg-muted rounded animate-pulse' />
          <div className='h-4 w-20 bg-muted rounded animate-pulse' />
        </div>
      </div>
    );
  }

  const { current_price, high_24h, low_24h } = data.market_data;
  const currentPrice = current_price.usd;
  const high = high_24h.usd;
  const low = low_24h.usd;

  // Calculate position percentage (0-100)
  const range = high - low;
  const positionPercentage =
    range > 0 ? ((currentPrice - low) / range) * 100 : 50;

  // Calculate percentage change from low to high
  const priceRange = ((high - low) / low) * 100;

  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-full'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>24h Trading Range</h3>
        <span className='text-sm text-muted-foreground'>
          Range: {priceRange.toFixed(2)}%
        </span>
      </div>

      <div className='space-y-3'>
        {/* Range Bar */}
        <div className='relative pt-6 pb-2'>
          {/* The bar background */}
          <div className='w-full h-2 bg-gray-200 rounded-full relative'>
            {/* Current price indicator */}
            <div
              className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300'
              style={{
                left: `${Math.min(Math.max(positionPercentage, 0), 100)}%`,
              }}
            >
              <div className='relative'>
                {/* Indicator dot */}
                <div className='w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg' />
                {/* Price label above */}
                <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap'>
                  <div className='bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg'>
                    {formatPrice(currentPrice)}
                  </div>
                  <div className='w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600 mx-auto' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low and High Labels */}
        <div className='flex justify-between items-start'>
          <div className='flex items-start gap-2'>
            <div className='p-1.5 rounded-md bg-muted'>
              <ArrowDownRight className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>24h Low</p>
              <p className='text-sm font-semibold'>{formatPrice(low)}</p>
            </div>
          </div>

          <div className='flex items-start gap-2 text-right'>
            <div className='order-2 p-1.5 rounded-md bg-muted'>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </div>
            <div className='order-1'>
              <p className='text-xs text-muted-foreground'>24h High</p>
              <p className='text-sm font-semibold'>{formatPrice(high)}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className='pt-3 border-t'>
          <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
            <span>Current price is</span>
            <span className='font-semibold text-primary'>
              {positionPercentage.toFixed(1)}%
            </span>
            <span>within the 24h range</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceRangeBar;
