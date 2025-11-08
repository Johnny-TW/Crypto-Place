import { TrendingUp, TrendingDown } from 'lucide-react';

interface ATHATLData {
  ath: { usd: number };
  ath_date: string;
  ath_change_percentage: { usd?: number } | number;
  atl: { usd: number };
  atl_date: string;
  atl_change_percentage: { usd?: number } | number;
}

interface CryptoData {
  market_data?: ATHATLData;
}

interface PriceMilestonesProps {
  data: CryptoData | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatPrice = (price: number): string => {
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getPercentageValue = (
  value: { usd?: number } | number | undefined
): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value.usd !== undefined) return value.usd;
  return 0;
};

function PriceMilestones({ data }: PriceMilestonesProps) {
  if (!data || !data.market_data) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
        {[1, 2].map(index => (
          <div key={index} className='rounded-lg border bg-card shadow-sm p-6'>
            <div className='h-6 w-24 bg-muted rounded animate-pulse mb-3' />
            <div className='h-8 w-32 bg-muted rounded animate-pulse mb-2' />
            <div className='h-4 w-20 bg-muted rounded animate-pulse' />
          </div>
        ))}
      </div>
    );
  }

  const {
    ath,
    ath_date,
    ath_change_percentage,
    atl,
    atl_date,
    atl_change_percentage,
  } = data.market_data;

  // Convert percentage values to numbers safely
  const athChangePercent = getPercentageValue(ath_change_percentage);
  const atlChangePercent = getPercentageValue(atl_change_percentage);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
      {/* All-Time High Card */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-md'>
              <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-500' />
            </div>
            <h3 className='text-sm font-semibold'>All-Time High</h3>
          </div>
        </div>

        <div className='mb-4'>
          <p className='text-3xl font-bold tracking-tight'>
            {formatPrice(ath.usd)}
          </p>
          <p className='text-sm text-muted-foreground mt-1'>
            {formatDate(ath_date)}
          </p>
        </div>

        <div className='flex items-center gap-2 pt-3 border-t'>
          <span className='text-sm text-muted-foreground'>
            Current distance:
          </span>
          <span
            className={`text-sm font-semibold ${
              athChangePercent >= 0
                ? 'text-green-600 dark:text-green-500'
                : 'text-destructive'
            }`}
          >
            {athChangePercent >= 0 ? '+' : ''}
            {athChangePercent.toFixed(2)}%
          </span>
          {athChangePercent < 0 && (
            <span className='text-xs text-muted-foreground'>below ATH</span>
          )}
        </div>
      </div>

      {/* All-Time Low Card */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-md'>
              <TrendingDown className='h-5 w-5 text-red-600 dark:text-red-500' />
            </div>
            <h3 className='text-sm font-semibold'>All-Time Low</h3>
          </div>
        </div>

        <div className='mb-4'>
          <p className='text-3xl font-bold tracking-tight'>
            {formatPrice(atl.usd)}
          </p>
          <p className='text-sm text-muted-foreground mt-1'>
            {formatDate(atl_date)}
          </p>
        </div>

        <div className='flex items-center gap-2 pt-3 border-t'>
          <span className='text-sm text-muted-foreground'>Current gain:</span>
          <span
            className={`text-sm font-semibold ${
              atlChangePercent >= 0
                ? 'text-green-600 dark:text-green-500'
                : 'text-destructive'
            }`}
          >
            {atlChangePercent >= 0 ? '+' : ''}
            {atlChangePercent.toFixed(2)}%
          </span>
          {atlChangePercent > 0 && (
            <span className='text-xs text-muted-foreground'>above ATL</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PriceMilestones;
