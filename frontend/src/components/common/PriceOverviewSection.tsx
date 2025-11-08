import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  TrendingUp,
  Building2,
  Coins,
} from 'lucide-react';

interface MarketData {
  current_price: {
    usd: number;
  };
  price_change_percentage_24h: number;
  market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
}

interface CryptoData {
  market_data: MarketData;
}

interface PriceOverviewSectionProps {
  data: CryptoData | null;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

function PriceOverviewSection({ data }: PriceOverviewSectionProps) {
  // 如果沒有資料，顯示 loading 或空狀態
  if (!data || !data.market_data) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='rounded-lg border bg-card shadow-sm p-6'>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-5 bg-muted rounded animate-pulse' />
              <div className='text-right'>
                <div className='h-4 w-20 bg-muted rounded animate-pulse mb-2' />
                <div className='h-6 w-24 bg-muted rounded animate-pulse' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5'>
      {/* Current Price */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex justify-between items-center'>
          <div className='p-2 rounded-md bg-muted'>
            <DollarSign className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Current Price</p>
            <p className='text-xl font-bold tracking-tight'>
              ${data.market_data.current_price.usd.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 24h Change */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex justify-between items-center'>
          <div
            className={`p-2 rounded-md ${
              data.market_data.price_change_percentage_24h >= 0
                ? 'bg-green-100 dark:bg-green-900/20'
                : 'bg-destructive/10'
            }`}
          >
            <TrendingUp
              className={`h-5 w-5 ${
                data.market_data.price_change_percentage_24h >= 0
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-destructive'
              }`}
            />
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>24h Change</p>
            <p
              className={`text-xl font-bold tracking-tight ${
                data.market_data.price_change_percentage_24h >= 0
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-destructive'
              }`}
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

      {/* Market Cap */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex justify-between items-center'>
          <div className='p-2 rounded-md bg-muted'>
            <Building2 className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Market Cap</p>
            <p className='text-xl font-bold tracking-tight'>
              {formatNumber(data.market_data.market_cap.usd)}
            </p>
          </div>
        </div>
      </div>

      {/* 24h Volume */}
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all'>
        <div className='flex justify-between items-center'>
          <div className='p-2 rounded-md bg-muted'>
            <Coins className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>24h Volume</p>
            <p className='text-xl font-bold tracking-tight'>
              {formatNumber(data.market_data.total_volume.usd)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceOverviewSection;
